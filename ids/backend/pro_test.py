import os
import argparse
from Feature_extraction import Feature_extraction
import pickle
import pandas as pd
import shutil
from multiprocessing import Process
import multiprocessing
import numpy as np


### Constant Variables - START ###############################################################
# Models and skaler 
SKALER_PATH = '../../sklearn_results/scaler.pkl'
ATTACK_MODEL_PATH = '../../sklearn_results/BaggingClassifier_2_model.pkl'
ATTACK_TYPE_MODEL_PATH = '../../sklearn_results/BaggingClassifier_8_model.pkl'
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
split_directory = './split_temp/' 
destination_directory = './output/'
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


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description="Generate .csv files from .pcap files",  
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='Authors: Costas Iordanou'
    )
    parser.add_argument('-i', '--input', 
        help='The input .pcap files', 
        required=True
    )
    args =parser.parse_args()
    input_file = args.input
    
    # Check if the user provided a pcap file.
    if not input_file.endswith(".pcap"):
        raise tool_exception(f"Input file is not supported ({input_file}). Please provide a .pcap file.\nExiting...")
    
    # Prepare pcap preprocessing temporary folders
    create_folder_if_note_exists(split_directory)
    create_folder_if_note_exists(destination_directory)
    clean_directory(split_directory)
    clean_directory(destination_directory)
    
    # Check available CPU cores
    n_threads = multiprocessing.cpu_count() - 1
    print(f"{n_threads = }")
    
    print(">>>> 1. splitting the .pcap file.")
    os.system('aa-exec -p unconfined tcpdump -r '+ input_file +' -w ' + split_directory + 'split_temp -C ' + str(subfiles_size) + ' -Z root')
    subfiles = os.listdir(split_directory)
    
    print(">>>> 2. Converting (sub) .pcap files to .csv files.")
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
    
    print(">>>> 3. Removing (sub) .pcap files.")
    for sf in subfiles:
        os.remove(split_directory + sf)

    print(">>>> 4. Merging (sub) .csv files (summary).")
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

    print(">>>> 5. Removing (sub) .csv files.")
    for cf in csv_subfiles:
        os.remove(destination_directory + cf)
    print(f'Done! ({input_file}), total_errors= ' + str(errors))
    
    # Extract features from pcap file
    # print(">>>> 6. Processing pcap file. Generating features csv file ...")
    # fe = Feature_extraction()
    # fe.pcap_evaluation(input_file, output_file)
    csv_file = output_file + '.csv'
    
    # Load the csv file
    data = pd.read_csv(csv_file)
    
    # Load the scaler
    scaler = pickle.load(open(SKALER_PATH, 'rb'))
    
    # Load the models
    attack_model = pickle.load(open(ATTACK_MODEL_PATH, 'rb'))
    attack_type_model = pickle.load(open(ATTACK_TYPE_MODEL_PATH, 'rb'))
    
    print(">>>> 7. Predicting ...")
    data[X_columns] = scaler.transform(data[X_columns])
    
    # Attack prediction
    predicted_attacks = attack_model.predict_proba(data[X_columns])
    # Attack type prediction
    predicted_attacks_type = attack_type_model.predict_proba(data[X_columns])
    
    # Prepare the final report
    RES = []
    for attack_propability, attack_type_propability, i in zip(predicted_attacks, predicted_attacks_type, data.iterrows()):
        index, row = i
        # print(f"{row['src_mac']}-{row['dst_mac']}")
        e = {'src': row['src_mac'],'dst': row['dst_mac']}

        # Process attack probabilities
        attack_propability = list(attack_propability)
        # for ac, ap in zip(list(attack_model.classes_), attack_propability):
        #     print(f"{ac}: {ap}")
        # Check if we have an attack or not.
        max_val_a = max(attack_propability)
        max_idx_a = attack_propability.index(max_val_a)
        if max_val_a > ATTACK_PREDICTION_THRESHOLD:
            # print(f"Correct - {attack_model.classes_[max_idx_a]}: {max_val_a}")
            isAttack = True
        else:
            # print(f"Wrong - {attack_model.classes_[max_idx_a]}: {max_val_a}")
            isAttack = False
        e['isAttack'] = isAttack # Boolean to identify if we have attack or not
        e['attack_prob'] = max_val_a # and the corresponding probability
        
        # If we have an attack, try also to predict the attack type
        if isAttack:
            e['details'] = {"probs": {}, "attack_type": "Unknown"}
            attack_type_propability = list(attack_type_propability)
            for ac_t, ap_t in zip(list(attack_type_model.classes_), attack_type_propability):
                # print(f"{ac_t}: {ap_t}")
                e['details']['probs'][ac_t] = ap_t

            max_val_t = max(attack_type_propability)
            max_idx_t = attack_type_propability.index(max_val_t)
            if max_val_t > ATTACK_TYPE_PREDICTION_THRESHOLD:
                # print(f"Correct - {model.classes_[max_idx_t]}: {max_val_t}\n")
                attack_type = attack_type_model.classes_[max_idx_t]
                if attack_type == "Bening":
                    e['details']['attack_type'] = "Unknown"
                else:
                    e['details']['attack_type'] = attack_type
            # else:
                # print(f"Wrong - {model.classes_[max_idx_t]}: {max_val_t}\n")
        RES.append(e)
    
    res_df = pd.DataFrame(RES)

    # Save to file
    res_df.to_json("test_res.jsonl", orient='records', lines=RESULTS_TO_JSONL)
    # Get the results in memory
    # print(res_df.to_json(orient='records', lines=True))