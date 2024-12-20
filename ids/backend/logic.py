import os
import shutil
import multiprocessing
from multiprocessing import Process
import numpy as np
import pandas as pd
import streamlit as st
import pickle
from backend.Feature_extraction import Feature_extraction
from backend.email_alert_template import email_template
import requests
import datetime


### Constant Variables - START ###############################################################
# Models and skaler 
SKALER_PATH = 'models/scaler.pkl'
ATTACK_MODEL_PATH = 'models/BaggingClassifier_2_model.pkl'
ATTACK_TYPE_MODEL_PATH = 'models/BaggingClassifier_8_model.pkl'
# Prediction thresholds
ATTACK_PREDICTION_THRESHOLD = 0.6
ATTACK_TYPE_PREDICTION_THRESHOLD = 0.6
# Output formating
RESULTS_TO_JSONL = True
# Input features and pcap preprocessing
X_columns = [
    'flow_duration', 'Header_Length', 'Protocol Type', 'Duration',
    'Rate', 'Srate', 'Drate', 'fin_flag_number', 'syn_flag_number',
    'rst_flag_number', 'psh_flag_number', 'ack_flag_number',
    'ece_flag_number', 'cwr_flag_number', 'ack_count',
    'syn_count', 'fin_count', 'urg_count', 'rst_count', 
    'HTTP', 'HTTPS', 'DNS', 'Telnet', 'SMTP', 'SSH', 'IRC', 'TCP',
    'UDP', 'DHCP', 'ARP', 'ICMP', 'IPv', 'LLC', 'Tot sum', 'Min',
    'Max', 'AVG', 'Std', 'Tot size', 'IAT', 'Number', 'Magnitue',
    'Radius', 'Covariance', 'Variance', 'Weight', 
]
subfiles_size = 10 # MB
split_directory = './splitted_pcaps_temp/' 
destination_directory = './splitted_csv_temp/'
### Constant Variables - END #################################################################


### Support functions - START ################################################################
def clean_directory(folder):
    for filename in os.listdir(folder):
        file_path = os.path.join(folder, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print('Failed to delete %s. Reason: %s' % (file_path, e))
    create_folder_if_note_exists(folder)


def create_folder_if_note_exists(folder):
    if not os.path.exists(folder):
        os.makedirs(folder)


# To print custom exceptions
class tool_exception(Exception):
    pass
### Support functions - END ##################################################################


def start_preprocessing(info, input_file):
    # input_file = "backend/pcap/uploaded.pcap"
    info.write("Splitting pcap file ...")
    subfiles = split_pcap(input_file)
    info.write("Convert splited pcap file to csv files ...")
    errors = covert2csv(subfiles)
    info.write("Merging csv filed ...")
    output_file = merge_csv_files(input_file)
    info.write(f'Done! ({input_file}), total_errors= ' + str(errors))
    return output_file + '.csv'


# 1. splitting the .pcap file.
def split_pcap(input_file):
    # Prepare pcap preprocessing temporary folders
    create_folder_if_note_exists(split_directory)
    create_folder_if_note_exists(destination_directory)
    clean_directory(split_directory)
    clean_directory(destination_directory)
    os.system('tcpdump -r '+ input_file +' -w ' + split_directory + 'split_temp -C ' + str(subfiles_size) + ' -Z root > /dev/null 2>&1')
    subfiles = os.listdir(split_directory)
    return subfiles
    

# 2. Converting (sub) .pcap files to .csv files.   
def covert2csv(subfiles):
    # Check available CPU cores
    n_threads = multiprocessing.cpu_count() - 1
    # print(f"{n_threads = }")
    processes = []
    errors = 0
    subfiles_threadlist = np.array_split(subfiles, (len(subfiles)/n_threads)+1)
    for f_list in subfiles_threadlist:
        n_processes = min(len(f_list), n_threads)
        assert n_threads >= n_processes
        assert n_threads >= len(f_list)
        processes = []
        for i in range(n_processes):
            fe = Feature_extraction()
            f = f_list[i]
            subpcap_file = split_directory + f
            p = Process(target=fe.pcap_evaluation, args=(subpcap_file,destination_directory + f.split('.')[0]))
            p.start()
            processes.append(p)
        for p in processes:
            p.join()
    assert len(subfiles)==len(os.listdir(destination_directory))
    
    # 3. Removing (sub) .pcap files.
    for sf in subfiles:
        os.remove(split_directory + sf)
    return errors
    

# 4. Merging (sub) .csv files (summary). 
def merge_csv_files(input_file):
    output_file = input_file.split(".")[0]
    csv_subfiles = os.listdir(destination_directory)
    mode = 'w'
    for f in csv_subfiles:
        try:
            d = pd.read_csv(destination_directory + f)
            d.to_csv(output_file + ".csv", header=mode=='w', index=False, mode=mode)
            mode='a'
        except:
            pass
        
    # 5. Removing (sub) .csv files.
    for cf in csv_subfiles:
        os.remove(destination_directory + cf)
    return output_file


def start_predictions(info, csv_file):
    info.write("Loading models ...")
    attack_model, attack_type_model, scaler = load_ml_resources()
    # Load the csv file
    info.write("Loading csv features ...")
    data = pd.read_csv(csv_file)
    data[X_columns] = scaler.transform(data[X_columns])
    # Attack prediction
    info.write("Predicting attacks ...")
    predicted_attacks = attack_model.predict_proba(data[X_columns])
    # Attack type prediction
    info.write("Predicting attacks type ...")
    predicted_attacks_type = attack_type_model.predict_proba(data[X_columns])
    info.write("Generating prediction results ...")
    return generate_prediction_results(attack_model, predicted_attacks, attack_type_model, predicted_attacks_type, data)
    
    
def  generate_prediction_results(attack_model, predicted_attacks, attack_type_model, predicted_attacks_type, data):
    RES = []
    for attack_propability, attack_type_propability, i in zip(predicted_attacks, predicted_attacks_type, data.iterrows()):
        _, row = i
        e = {'src': row['src_mac'],'dst': row['dst_mac']}

        # Process attack probabilities
        attack_propability = list(attack_propability)
        max_val_a = max(attack_propability)
        max_idx_a = attack_propability.index(max_val_a)
        if attack_model.classes_[max_idx_a] == 'Attack' and max_val_a > ATTACK_PREDICTION_THRESHOLD:
            isAttack = True
        else:
            isAttack = False
        e['isAttack'] = isAttack # Boolean to identify if we have attack or not
        e['attack_prob'] = max_val_a # and the corresponding probability
        # If we have an attack, try also to predict the attack type
        if isAttack:
            e['details'] = {"probs": {}, "attack_type": "Unknown"}
            attack_type_propability = list(attack_type_propability)
            for ac_t, ap_t in zip(list(attack_type_model.classes_), attack_type_propability):
                e['details']['probs'][ac_t] = ap_t
            max_val_t = max(attack_type_propability)
            max_idx_t = attack_type_propability.index(max_val_t)
            if max_val_t > ATTACK_TYPE_PREDICTION_THRESHOLD:
                attack_type = attack_type_model.classes_[max_idx_t]
                if attack_type == "Bening":
                    e['details']['attack_type'] = "Unknown"
                else:
                    e['details']['attack_type'] = attack_type
        RES.append(e)
    res_df = pd.DataFrame(RES)
    # Save to file
    # res_df.to_json("test_res.jsonl", orient='records', lines=RESULTS_TO_JSONL)
    # Get the results in memory
    # print(res_df.to_json(orient='records', lines=True))
    return res_df


@st.cache_resource
def load_ml_resources():
    # Load the scaler
    scaler = pickle.load(open(SKALER_PATH, 'rb'))
    # Load the models
    attack_model = pickle.load(open(ATTACK_MODEL_PATH, 'rb'))
    attack_type_model = pickle.load(open(ATTACK_TYPE_MODEL_PATH, 'rb'))
    return attack_model, attack_type_model, scaler

def send_notification_email(URL, file_name, email):
    url = URL + f'/email/send'
    content = email_template%(file_name, datetime.datetime.today().year)
    data = {
        "recipient": email,
        "subject": "MedSecurance IDS Alert",
        "htmlContent": content
    }
    try:
        return http_email_medsec(
            method='post',
            args=[url],
            kwargs=dict(json=data, timeout=10)
        )
    except IOError:
        return None


def http_email_medsec(method='post', args=[], kwargs={}):
    """
    Issues an HTTP request to send notification email to the backend.

    Returns ''. If the request fails, raises IOError and logs the failure.

    """
    if method not in ['get', 'post']:
        raise RuntimeError('Unsupported method: %s' % method)

    # Make the request
    try:
        if method == 'get':
            r = requests.get(*args, **kwargs)
        else:
            r = requests.post(*args, **kwargs)
    except Exception as ex:
        print(f'[http_request] Error: request with args {args} failed to complete: {ex}')
        raise IOError

    # Report erro if status code is different than 2XX
    if int(r.status_code / 100) != 2:
        print(f'[http_request] Error: request with args {args} failed with status code {r.status_code}')
        raise IOError