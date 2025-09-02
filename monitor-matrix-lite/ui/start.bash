#!/bin/bash
source ./env/bin/activate
cd ./ui
# Use the following in production
# streamlit run Device_List.py --server.port 33762 --browser.gatherUsageStats false --server.headless true --server.baseUrlPath "inspector_dashboard"

# Use the following in developement enviroment
# source ../.env
sudo -E env PATH=$PATH streamlit run Device_List.py --server.port 33762 --browser.gatherUsageStats false --server.headless true --server.baseUrlPath "inspector_dashboard"

deactivate
cd ..