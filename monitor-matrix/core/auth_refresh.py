import time
from core import global_state
import auth

def refresh_token_loop():
    while True:
        time.sleep(30)  # Check every 30 seconds

        with global_state.token_lock:
            expires_at = global_state.token.get('expires_at', 0)
            refresh_token_value = global_state.token.get('refresh_token', '')

        if time.time() > expires_at - 60:  # 1 minute before expiry
            try:
                new_token = auth.refresh_token(refresh_token_value)

                with global_state.token_lock:
                    global_state.token['access_token'] = new_token['access_token']
                    global_state.token['refresh_token'] = new_token['refresh_token']
                    global_state.token['expires_at'] = new_token['expires_at']

                print("[Token Refresh] Refreshed access token.")

            except Exception as e:
                print(f"[Token Refresh] Failed to refresh token: {e}")
