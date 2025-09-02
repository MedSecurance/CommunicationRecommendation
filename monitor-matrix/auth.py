from authlib.integrations.requests_client import OAuth2Session
import streamlit as st
import urllib.parse
import time
import os
from core import global_state

# --- CONFIG ---
KEYCLOAK_URL = os.environ.get("KEYCLOAK_URL", "localhost:8080")
KEYCLOAK_TOKEN_URL = os.environ.get('KEYCLOAK_TOKEN_URL', "http://medsec-keycloak:8080")
REALM = "MedSec"
CLIENT_ID = "med-sec-portal"
REDIRECT_URI = "http://localhost:33761/inspector_dashboard/Overview"
AUTH_URL = f"{KEYCLOAK_URL}/realms/{REALM}/protocol/openid-connect/auth"
TOKEN_URL = f"{KEYCLOAK_TOKEN_URL}/realms/{REALM}/protocol/openid-connect/token"
USERINFO_URL = f"{KEYCLOAK_TOKEN_URL}/realms/{REALM}/protocol/openid-connect/userinfo"
COOKIE_SECRET = "your-long-secret-here"  # Change this in production!

# --- HELPERS ---
def get_login_url(state):
    params = {
        "client_id": CLIENT_ID,
        "response_type": "code",
        "scope": "openid profile email",
        "redirect_uri": REDIRECT_URI,
        "state": state,
    }
    return AUTH_URL + "?" + urllib.parse.urlencode(params)


def fetch_token(code):
    client = OAuth2Session(CLIENT_ID, redirect_uri=REDIRECT_URI)
    token = client.fetch_token(TOKEN_URL, code=code)

    if "expires_in" in token:
        token["expires_at"] = int(time.time()) + int(token["expires_in"])

    return token


def get_user_info(token):
    client = OAuth2Session(CLIENT_ID, token=token)
    return client.get(USERINFO_URL).json()


def is_token_expired(token):
    return token.get("expires_at", 0) <= time.time()

# --- MAIN LOGIN LOGIC ---

def ensure_user_logged_in():
    query_params = st.query_params

    # Step 1: If valid token exists in global_state, return it
    with global_state.token_lock:
        token = global_state.token
        if token.get("access_token") and token.get("expires_at", 0) > time.time():
            return token

    # Step 2: If redirected with a code, exchange it
    if "code" in query_params:
        try:
            code = query_params.get("code")
            if isinstance(code, list):
                code = code[0]

            token = fetch_token(code)

            with global_state.token_lock:
                global_state.token["access_token"] = token["access_token"]
                global_state.token["refresh_token"] = token["refresh_token"]
                global_state.token["expires_at"] = token["expires_at"]

            st.query_params.clear()
            return global_state.token

        except Exception as e:
            st.query_params.clear()
            st.error(f"Login failed: {e}")
            st.stop()

    # Step 3: Show login prompt
    state = "some_random_state"
    login_url = get_login_url(state)
    st.warning("You must log in to access this page.")
    st.markdown(f"[Click here to log in]({login_url})", unsafe_allow_html=True)
    st.stop()


def refresh_token(refresh_token: str) -> dict:
    client = OAuth2Session(CLIENT_ID)
    token = client.refresh_token(
        TOKEN_URL,
        refresh_token=refresh_token,
        redirect_uri=REDIRECT_URI,
    )

    # Set absolute expiry timestamp
    if "expires_in" in token:
        token["expires_at"] = int(time.time()) + int(token["expires_in"])

    return token