"""
Add friendly names to entities.

"""
import core.model as model
import streamlit as st
import core.common as common
import core.global_state as global_state
import core.networking as networking
from core.oui_parser import get_vendor
from core.ttl_cache import ttl_cache
from core.email_alert_template import email_template
import os
import geoip2.database
import functools
import tldextract
import json
import socket
import datetime

ip_country_parser = geoip2.database.Reader(
    os.path.join(
        common.get_python_code_directory(), '..', 'data', 'maxmind-country.mmdb'
    )
)

tracker_directory = os.path.join(
    common.get_python_code_directory(), '..', 'data'
)


# Source: https://github.com/duckduckgo/tracker-blocklists/tree/main
tracker_json_list = [
    os.path.join(tracker_directory, 'tds.json'),
    os.path.join(tracker_directory, 'apple-tds.json'),
    os.path.join(tracker_directory, 'android-tds.json')
]


def add_product_info_to_devices(token : str):

    updated_row_count = 0
    # Find all distinct MAC addresses for which the is_inspected field is 1
    with model.db:
        q = model.Device.select(model.Device.mac_addr) \
            .group_by(model.Device.mac_addr) \
            .where(model.Device.is_inspected == 1)
        mac_addr_list = [device.mac_addr for device in q]
    
    # Generate a dictionary with information about new devices to request device name 
    # from back end every x minutes and send notification email every y days. 
    mac_name_list = {}
    try:
        for m in mac_addr_list:
            with model.db:
                # Get device name if already exists to avoid requesting it from the back end
                n = model.Device.select(model.Device.product_name) \
                    .where(model.Device.mac_addr == m)
                if n[0].product_name is not None: 
                    mac_name_list[m] = {'name': n[0].product_name}
                else:
                    mac_name_list[m] = {'name': None}
                # Get the device name update request time
                x = model.Device.select(model.Device.updated_at) \
                    .where(model.Device.mac_addr == m)
                if x[0].updated_at is not None: 
                    mac_name_list[m]['updated_at'] = x[0].updated_at
                else:
                    mac_name_list[m]['updated_at'] = None
                # Get the device email notification request time
                y = model.Device.select(model.Device.notify_at) \
                    .where(model.Device.mac_addr == m)
                if y[0].notify_at is not None: 
                    mac_name_list[m]['notify_at'] = y[0].notify_at
                else:
                    mac_name_list[m]['notify_at'] = None
    except Exception as e:
        pass

    # For each MAC address, find the corresponding product name
    inferred_product_name_dict = dict()
    for mac_addr in mac_addr_list:
        friendly_names = []
        product_name = None
        # Check if we already have the device name
        if mac_addr in mac_name_list and mac_name_list[mac_addr]['name'] != "":
            product_name = mac_name_list[mac_addr]['name']
        else:
            # If we do not have the name but we saw the device before prepare the rec helper object
            if mac_addr in mac_name_list:
                rec = mac_name_list[mac_addr]
                rec['mac_addr'] = mac_addr
            else:
                rec = None
            # Check if update delay already pass to request device name from the backend server
            update_delay = int(global_state.UPDATE_DELAY)
            # print("Update name delay", datetime.datetime.now() - rec['updated_at'], datetime.timedelta(minutes=update_delay))
            if datetime.datetime.now() - rec['updated_at'] > datetime.timedelta(minutes=update_delay):
                # print(f"\nRequesting name: {rec}\n")
                # Request the product name from the backend
                product_name = get_product_name_from_backend(mac_addr.upper() , token)
                if product_name is not None:
                    # We manage to get the device name
                    save_product_name_to_db(product_name, mac_addr)
                    common.log(f"[Friendly Organizer] Update device name with mac address {mac_addr} to {product_name} ")
                else:
                    # The device name is still unknown, just update the updated_at timestamp
                    save_product_name_to_db('', mac_addr)
                    email_delay = int(global_state.EMAIL_DELAY)
                    # Send initial email notification and if the device remains unknown the notification will be send every Y days
                    # print(rec['notify_at'])
                    if rec['notify_at'] is None:
                        send_notification_email(rec)
                        # Update the notify_at timestamp after sending an email
                        update_notify_email_timestamp_to_db(mac_addr)
                        common.log(f"[Friendly Organizer] Sending email for unknown device with mac address: {mac_addr}")

                    # Check if we need to notify user for a new unknown device 
                    else:
                        # print("Notify email delay", datetime.datetime.now() - rec['notify_at'], datetime.timedelta(days=email_delay))
                        if datetime.datetime.now() - rec['notify_at'] > datetime.timedelta(days=email_delay):
                            # print(f"\nSending email: {rec}\n")
                            send_notification_email(rec)
                            # Update the notify_at timestamp after sending an email
                            update_notify_email_timestamp_to_db(mac_addr)
                            common.log(f"[Friendly Organizer] Sending email for unknown device with mac address: {mac_addr}")
        
        oui_vendor = get_vendor(mac_addr)
        if product_name:
            friendly_names.append(product_name)
        if oui_vendor:
            friendly_names.append(oui_vendor)
        if not friendly_names:
            continue
        inferred_product_name_dict[mac_addr] = ' / '.join(friendly_names)

    # Update the database with the inferred product names into the `friendly_product` field
    with model.write_lock:
        with model.db:
            for mac_addr, product_name in inferred_product_name_dict.items():
                row_count = model.Device.update(
                    friendly_product=product_name
                ).where(model.Device.mac_addr == mac_addr
                ).execute()
                updated_row_count += row_count

    common.log(f'[Friendly Organizer] Updated {updated_row_count} rows of product info.')


def send_notification_email(rec):
    url = global_state.BACKEND_URL + f'/email/send'
    content = email_template%(rec['mac_addr'], datetime.datetime.today().year)
    data = {
        "recipient": global_state.ADMIN_EMAIL,
        "subject": "MedSecurance Alert",
        "htmlContent": content
    }
    try:
        return common.http_email_medsec(
            method='post',
            args=[url],
            kwargs=dict(json=data, timeout=10)
        )
    except IOError:
        return None


def get_product_name_from_backend(macAddress: str , token: str) -> str:
    url = global_state.BACKEND_URL + f'/device-manager/devices?macAddress={macAddress}'

    headers = {
        "Authorization": f"Bearer {token}"
    }

    try:
        return common.http_request_medsec(
            method='get',
            field_to_extract='name',
            args=[url],
            kwargs=dict(headers=headers, timeout=10)
        )
    except IOError:
        return None

def save_product_name_to_db(name, device_mac_addr):
    with model.write_lock:
        with model.db:
            # Update the product_name field of the device, given the mac_addr
            query = model.Device \
                .update(product_name=f"{name}") \
                .where(model.Device.mac_addr == device_mac_addr)
            query.execute()
            query = model.Device \
                .update(updated_at=f"{datetime.datetime.now()}") \
                .where(model.Device.mac_addr == device_mac_addr)
            query.execute()


def update_notify_email_timestamp_to_db(device_mac_addr):
    with model.write_lock:
        with model.db:
            query = model.Device \
                .update(notify_at=f"{datetime.datetime.now()}") \
                .where(model.Device.mac_addr == device_mac_addr)
            query.execute()


@ttl_cache(maxsize=8192, ttl=15)
def get_hostname_from_ip_addr(ip_addr: str, in_memory_only=False) -> str:
    """
    Returns the hostname associated with an IP address.

    Returns an empty string if the hostname is not found.

    """
    if networking.is_private_ip_addr(ip_addr):
        return '(local network)'

    # Ask the in-memory cache
    try:
        with global_state.global_state_lock:
            return global_state.hostname_dict[ip_addr]
    except KeyError:
        pass

    if in_memory_only:
        return ''

    # Ask the database
    try:
        with model.db:
            hostname = model.Hostname.get(model.Hostname.ip_addr == ip_addr).hostname
            if hostname:
                # Save the hostname value in memory
                with global_state.global_state_lock:
                    global_state.hostname_dict[ip_addr] = hostname
                return hostname
    except model.Hostname.DoesNotExist:
        pass

    try:
        res = socket.gethostbyaddr(ip_addr)
        c_domain = tldextract.extract(res[0]).registered_domain
        # print(f"{res = }, {c_domain = }")
        with global_state.global_state_lock:
                global_state.hostname_dict[ip_addr] = c_domain
        return c_domain
    except Exception:
        # print(f"+++ exeption +++ {ip_addr = }")
        pass

    return ''



def add_hostname_info_to_flows():
    """
    Adds hostname, reg_domain, and tracker_company to flows retroactively.

    """
    updated_row_count = 0

    for direction in ['src', 'dst']:

        ip_addr_col = getattr(model.Flow, f'{direction}_ip_addr')
        hostname_col = getattr(model.Flow, f'{direction}_hostname')
        mac_addr_col = getattr(model.Flow, f'{direction}_device_mac_addr')

        ip_addr_list = list()

        # Find all distinct IP addresses for which the hostname field is empty

        with model.db:
            q = model.Flow.select(ip_addr_col) \
                .group_by(ip_addr_col) \
                .where((ip_addr_col != '') & (hostname_col == '') & (mac_addr_col == ''))
            ip_addr_list = [getattr(flow, f'{direction}_ip_addr') for flow in q]

        # For each IP address, find the corresponding hostname and update the
        # reg_domain and tracker_company fields

        for ip_addr in ip_addr_list:
            # Find the hostname from various sources; could be a slow operation
            hostname = get_hostname_from_ip_addr(ip_addr)
            if not hostname:
                continue
            reg_domain = get_reg_domain(hostname)
            tracker_company = get_tracker_company(reg_domain)
            with model.write_lock:
                with model.db:
                    row_count = model.Flow.update(
                        **{
                            f'{direction}_hostname': hostname,
                            f'{direction}_reg_domain': reg_domain,
                            f'{direction}_tracker_company': tracker_company
                        }
                    ).where(
                        (ip_addr_col == ip_addr) &
                        (hostname_col == '') &
                        (mac_addr_col == '')
                    ).execute()
                    updated_row_count += row_count

    common.log(f'[Friendly Organizer] Updated {updated_row_count} rows of hostname info.')


@functools.lru_cache(maxsize=8192)
def get_country_from_ip_addr(remote_ip_addr):
    """Returns country for IP."""

    if networking.is_private_ip_addr(remote_ip_addr):
        return '(local network)'

    try:
        country = ip_country_parser.country(remote_ip_addr).country.name
        if country:
            return country
    except Exception:
        pass

    return ''


def parse_tracking_json(json_contents):

    block_list_dict = dict()

    for domain, info in json_contents['trackers'].items():
        tracker_company = info['owner']['displayName']
        if tracker_company:
            block_list_dict[domain] = tracker_company

    return block_list_dict



@functools.lru_cache(maxsize=1)
def initialize_ad_tracking_db():
    """
    Initializes the AdTracker table with the default list of trackers. Ran only once at startup.

    """

    # If the AdTracker table is empty, initialize it with the default list
    with model.db:

        if model.AdTracker.select().count() > 0:
            return

        block_list_dict = dict()

        # Load trackers from file; may be outdated -- TODO: Update these lists
        # in future versions
        for tracker_json_file in tracker_json_list:
            with open(tracker_json_file, 'r') as f:
                block_list_dict.update(parse_tracking_json(json.load(f)))

        # Add trackers to database
        for hostname, tracker_company in block_list_dict.items():
            model.AdTracker.create(
                hostname=hostname,
                tracker_company=tracker_company
            )


@functools.lru_cache(maxsize=8192)
def get_tracker_company(hostname: str) -> str:
    """
    Returns the tracker company for a given hostname; if not a tracking company, returns an empty string

    """
    initialize_ad_tracking_db()

    uncertain = '?' in hostname
    hostname = hostname.replace('?', '')

    try:
        company =  model.AdTracker.get(model.AdTracker.hostname == hostname).tracker_company
    except model.AdTracker.DoesNotExist:
        return ''
    else:
        if uncertain:
            company += '?'
        return company


@functools.lru_cache(maxsize=8192)
def get_reg_domain(full_domain):

    if not full_domain:
        return ''

    if full_domain == '(local network)':
        return full_domain

    reg_domain = tldextract.extract(full_domain.replace('?', '')) \
        .registered_domain

    if reg_domain:
        if '?' in full_domain:
            reg_domain += '?'
        return reg_domain

    return full_domain
