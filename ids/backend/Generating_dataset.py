from backend.Feature_extraction import Feature_extraction
import time
import warnings
warnings.filterwarnings('ignore')
import os
from tqdm import tqdm
from multiprocessing import Process
import multiprocessing
import numpy as np
import pandas as pd
import argparse

from fnmatch import fnmatch
import shutil


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



if __name__ == '__main__':

    parser = argparse.ArgumentParser(
        description="Generate .csv files from .pcap files",  
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='Authors: Costas Iordanou'
    )
    parser.add_argument('-i', '--input', 
        help='The folder to search recursivly for .pcap files', 
        required=True
    )
    args =parser.parse_args()
    input_folder = args.input

    start = time.time()
    print("========== CIC IoT feature extraction ==========")
    
    # full_path = os.getcwd()
    # print(full_path)
    PCAP_DIRECTORY = input_folder #os.path.join(full_path, 'PCAPS/')
    print(PCAP_DIRECTORY)
    
    pattern = "*.pcap"
    
    pcapfiles = []
    for path, subdirs, files in os.walk(PCAP_DIRECTORY):
        for name in files:
            if fnmatch(name, pattern):
                pcapfiles.append(os.path.join(path, name))
    
    subfiles_size = 10 # MB
    split_directory = './split_temp/'
    destination_directory = './output/'
    
    create_folder_if_note_exists(split_directory)
    create_folder_if_note_exists(destination_directory)
    
    clean_directory(split_directory)
    clean_directory(destination_directory)
    
    n_threads = multiprocessing.cpu_count() - 1
    
    address = "./"
    
    for i in range(len(pcapfiles)):
        lstart = time.time()
        pcap_file = pcapfiles[i]
        print(pcap_file)
        print(">>>> 1. splitting the .pcap file.")
        os.system('aa-exec -p unconfined tcpdump -r '+ pcap_file +' -w ' + split_directory + 'split_temp -C ' + str(subfiles_size) + ' -Z root')
        subfiles = os.listdir(split_directory)
        print(">>>> 2. Converting (sub) .pcap files to .csv files.")
        processes = []
        errors = 0
        
        subfiles_threadlist = np.array_split(subfiles, (len(subfiles)/n_threads)+1)
        for f_list in tqdm(subfiles_threadlist):
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
        
        csv_subfiles = os.listdir(destination_directory)
        mode = 'w'
        for f in tqdm(csv_subfiles):
            try:
                d = pd.read_csv(destination_directory + f)
                d.to_csv(pcap_file + '.csv', header=mode=='w', index=False, mode=mode)
                mode='a'
            except:
                pass

        print(">>>> 5. Removing (sub) .csv files.")
        for cf in tqdm(csv_subfiles):
            os.remove(destination_directory + cf)
        print(f'done! ({pcap_file})(' + str(round(time.time()-lstart, 2))+ 's),  total_errors= '+str(errors))
        
    end = time.time()
    print(f'Elapsed Time = {(end-start)}s')
    
    
    
