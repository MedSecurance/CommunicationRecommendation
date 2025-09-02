#!/bin/bash

print_message(){
    echo ""
    echo $1
    echo ""
    sleep 2 # Waits for few second.
}

# Update the system
print_message "1 of 7: Updating system"
apt-get update && apt-get upgrade -y

# Install git
print_message "2 of 7: Installing Git"
apt-get install git -y

# Install libpcap dependencies
print_message "3 of 7: Installing libpcap dependencies"
apt install libpcap0.8 tcpdump libpcap0.8-dev -y

# Install Python3 virtual enviroment
print_message "4 of 7: Installing python3-virtualenv"
apt-get install python3-virtualenv -y

# Create the python virual enviroment
print_message "5 of 7: Creating the Python3 virtual enviroment"
virtualenv -p python3 env

# Loading the python virual enviroment
print_message "6 of 7: Loading the Python3 virtual enviroment"
source ./env/bin/activate

# Installing iot-inspector-client python dependencies
print_message "7 of 7: Installing iot-inspector-client python dependencies"
pip3 install -r requirements.txt

print_message "deployment.sh: DONE!"
