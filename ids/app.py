import streamlit as st
import backend.logic as logic
import time
import os
from dotenv import load_dotenv

load_dotenv()

ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "root@localhost")
BACKEND_URL = os.environ.get("BACKEND_URL", "localhost:8080")

PCAP_FOLDER = "backend/pcap"
PCAP_SAVED_LOCATION = f"{PCAP_FOLDER}/uploaded.pcap"


if not os.path.exists(PCAP_FOLDER):
    os.makedirs(PCAP_FOLDER)

st.set_page_config(
    page_title="Medsecurance Intrusion Detection System (IDS)", 
    page_icon="👁️‍🗨️", 
    layout="wide", 
    # initial_sidebar_state="expanded", 
    menu_items=None
)

lc, rc = st.columns([1, 4], vertical_alignment="bottom")
with lc:
    st.image("static/MedSec_logo.png")
with rc:
    st.title('Medsecurance Intrusion Detection System (IDS)')
st.divider()

with st.form("my-form", clear_on_submit=True):
    flc, frc = st.columns([5,5], vertical_alignment="bottom")
    with flc:
        file = st.file_uploader(
            "Upload your '*.pcap' file",
            type='.pcap',
            key='pcap_file',
            # disabled=st.session_state.disable,
            # on_change=st.session_state.get("disable", True),
            help='Upload you .pcap file to check it for attacks.',
        )
    # with frc:
    submitted = st.form_submit_button("Start / Reset (processing)")
    
    if submitted and file is not None:
        # with frc:
        st.markdown(f"#### Input file: {file.name} - Size: {file.size/1024/1024:.2f} MB")
        # do stuff with your uploaded file
        with st.spinner("Processing (pcap file) ..."):
            info = st.empty()
            info.write("Saving file to disk ...")
            info.write("Opening local file...")
            with open(PCAP_SAVED_LOCATION, "wb") as f:
                info.write("Writing data to file...")
                f.write(file.getbuffer())
            info.write("Done!")
            csv_file = logic.start_preprocessing(info, PCAP_SAVED_LOCATION)
            info.write("")
            alert = st.success(f"Pcap preprosessing done! Features file available at: {csv_file}")
            time.sleep(3) # Wait for 3 seconds
            alert.empty() # Clear the alert
            
        with st.spinner("Predicting (using csv file) ..."):
            df = logic.start_predictions(info, csv_file)    
            alert = st.success("Predictions process done!")
            info.write("")
            time.sleep(3) # Wait for 3 seconds
            alert.empty() # Clear the alert
        config = {
            "src": st.column_config.Column("Source MAC address", width="small", help="The flow source MAC Address", required=True),
            "dst": st.column_config.Column("Destination MAC address", width="small", help="The flow destination MAC Address", required=True),
            "isAttack": st.column_config.Column("Attack detected", width="small", help="The prediction for an attack or not", required=True),
            "attack_prob": st.column_config.Column("Attack Probability", width="small", help="The probability of the Attack or Not", required=True),
            "details": st.column_config.Column("Attack Type", help="If we have an attack, then what type of attack is", required=True)
        }
        st.divider()
        st.dataframe(df, use_container_width=True, column_config=config) # width=2048)
        # Send email if an attack is detected
        if 1 in df['isAttack']:
            st.html(f"Attacks detected.<br/>Filename: {file.name}<br/>Send email to <a href='mailto: {ADMIN_EMAIL}'> {ADMIN_EMAIL} <a/>")
            logic.send_notification_email(BACKEND_URL, file.name, ADMIN_EMAIL)
            
    else:
        if submitted:
            alert = st.error("Upload a pcap file first ...")
            time.sleep(3) # Wait for 3 seconds
            alert.empty() # Clear the alert