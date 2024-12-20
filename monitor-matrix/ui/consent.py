import time
import streamlit as st
import core.config as config
import os
import sidebar


def show():

    # Check if we need to show any risk consent
    if not config.get('has_consented_to_overall_risks', False):
        show_overall_risks()
        st.stop()


def show_overall_risks():

    # Show the consent
    with open(os.path.join(get_current_file_directory(), 'consent_overall_risks.md'), 'r', encoding='utf-8') as f:
        st.markdown(f.read(), unsafe_allow_html=True)

    st.divider()

    # Show a primary button to accept the consent
    consent = st.button('I accept the risks.', type='primary')
    if consent:
        config.set('has_consented_to_overall_risks', True)
        st.rerun()

    # Show a secondary button to reject the consent and quit
    reject = st.button('I do not accept the risks. I would like to quit IoT Inspector.', type='secondary')
    if reject:
        sidebar.quit()


def get_current_file_directory():
    """
    Returns the directory where this python file is located.

    """
    return os.path.dirname(os.path.abspath(__file__))

