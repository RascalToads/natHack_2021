import requests
import time
import traceback
import json

# modify these based on the expected server
# SERVER_IP = 'https://us-central1-nathack-2021.cloudfunctions.net/webhooksconfig/4'
SERVER_URL = 'https://us-central1-nathack-2021.cloudfunctions.net/webhooksconfig/4'
TEST_PORT = 3000
USE_REMOTE_SERVER = True

# internal tracking vars for recognizing error events
ERRORS_WERE_RESET = False
ERRORS_IN_A_ROW = 0
# if a call to a specific webhook url fails for the 20th time in a row, then
# the calling program will crash completely with the value error below
INITIAL_ERRORS_THRESHOLD = 20
# do not set this to 0, 1 will log every error, 5 will log every 5th error
LOG_LIMIT = 1
FIRST_TIMEOUT = 30
IS_FIRST = True


def make_server_call(
        payload,
        log_timing = False,
        timeout_s = 2,
        print_traceback = False,
):
    global FIRST_TIMEOUT
    global IS_FIRST
    global ERRORS_IN_A_ROW
    global ERRORS_WERE_RESET
    if IS_FIRST:
        timeout_s = 30
    IS_FIRST = False
    s = time.time()
    error = None
    if USE_REMOTE_SERVER:
        # url = f'http://localhost:{TEST_PORT}/'
        url = SERVER_URL
    else:
        url = f'http://localhost:{TEST_PORT}/'
    try:
        response = requests.post(
            url,
            data=json.dumps(payload),
            timeout=timeout_s,
            headers = {'Content-type': 'application/json'}
        )
    except Exception as err:
        error = err
        traceback_info = traceback.format_exc()
    if error or response.status_code != 200:
        ERRORS_IN_A_ROW += 1
        if ERRORS_IN_A_ROW % LOG_LIMIT == 0:
            if error:
                print(f'\nWARNING: call to {url} failed with error {error}')
                if print_traceback:
                    print(traceback_info)
            else:
                print(f'\nWARNING: call to {url} had status {response.status_code}')
    else:
        ERRORS_IN_A_ROW = 0
        ERRORS_WERE_RESET = True
    if ERRORS_IN_A_ROW >= INITIAL_ERRORS_THRESHOLD:
        msg = f'Unable to complete request to {url} on initial attempt {INITIAL_ERRORS_THRESHOLD}\n'
        if error:
            msg += f'failed with error {error}'
        else:
            msg += f'status: {response.status_code}, response: {response.text}'
        raise ValueError(msg)
    if log_timing:
        print(f'call to {url} took {time.time() - s}s')


def make_all_calls(
    brow_up: bool,
    brow_down: bool,
    blink: bool,
    eye: bool,
    concentration: bool,
    wink_left: bool,
    wink_right: bool,
    percent_concentration: float
):
    for value, eventName in [
        (brow_up, 'brow-up'),
        (brow_down, 'brow-down'),
        (blink, 'blink'),
        (eye, 'eye'),
        (wink_left, 'wink-left'),
        (wink_right, 'wink-right'),
        (concentration, 'concentration'),
        (percent_concentration, 'percent-concentration'),
    ]:
        if eventName != 'percent-concentration':
            payload = {
                'action': {
                    'value': 1 if bool(value) else 0,
                    'time': time.time()
                },
                'data': {},
                'type': eventName
            }
        else:
            payload = {
                'action': {
                    'value': int(value),
                    'time': time.time()
                },
                'data': {},
                'type': eventName
            }
        make_server_call(payload)
