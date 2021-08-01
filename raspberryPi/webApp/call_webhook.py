import requests

WEBHOOK_IP = 'localhost'
WEBHOOK_PORT = 14739
BROW_URL = f'http://{WEBHOOK_IP}:{WEBHOOK_PORT}/brow'
BLINK_URL= f'http://{WEBHOOK_IP}:{WEBHOOK_PORT}/blink'
EYE_URL = f'http://{WEBHOOK_IP}:{WEBHOOK_PORT}/eye'
WINK_LEFT_URL = f'http://{WEBHOOK_IP}:{WEBHOOK_PORT}/wink-left'
WINK_RIGHT_URL = f'http://{WEBHOOK_IP}:{WEBHOOK_PORT}/wink-right'
CONCENTRATION_URL = f'http://{WEBHOOK_IP}:{WEBHOOK_PORT}/concentration'

def make_webhook_call(webhook_url):
    response = requests.get(webhook_url)
    if response.status_code != 200:
        raise ValueError(
            'Request to slack returned an error %s, the response is:\n%s'
            % (response.status_code, response.text)
        )

def brow_up_webhook():
    make_webhook_call(webhook_url=BROW_URL + '-up')

def brow_down_webhook():
    make_webhook_call(webhook_url=BROW_URL + '-down')

def eye_movement_webhook():
    make_webhook_call(webhook_url=EYE_URL)

def concentration_webhook(concentration_val):
    make_webhook_call(webhook_url=CONCENTRATION_URL + str(concentration_val))
