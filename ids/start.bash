#!/bin/bash
source ./env/bin/activate
streamlit run app.py --server.port 8501 --browser.gatherUsageStats false --server.headless true