# 8/1 JG
import numpy as np
import time
import math
import requests
from scipy.signal import butter, lfilter
from typing import Any, Dict, List

METRICS_URL = 'https://api-server-7vjbw6wmkq-uc.a.run.app/api/v1/app/metrics'

def request_metrics(api_key: str, eeg_data: List[List[float]], metrics: List[str]) -> Dict[str, Any]:
    arg_dict = {'metrics': metrics, 'preprocess_steps' : [],}
    data = {'data': eeg_data, 'options' : arg_dict}
    headers = {'Authorization': "Bearer " + str(api_key), 'Content-Type': 'application/json',}
    resp_json = requests.post(METRICS_URL, json=data, headers=headers).json()
    if 'error' in resp_json:
        raise RuntimeError(resp_json['error'])
    processed_metrics = {}
    calculations = resp_json['calculations']
    if 'artifact_detect' in metrics:
        processed_metrics['artifact_detect'] = calculations['artifact_detect']
    if 'blink' in metrics:
        processed_metrics['blink'] = calculations['blink']
    if 'eye' in metrics:
        processed_metrics['eye'] = calculations['eye']
    if 'bandpower' in metrics:
        processed_metrics['bandpower'] = calculations['bandpower']
        
    return processed_metrics

def bandpass_filter(data, lowcut, highcut, sampling_rate, bandpass_order):
    nyq = 0.5 * sampling_rate
    low = lowcut / nyq
    high = highcut / nyq
    iir_numer, iir_denom = butter(bandpass_order, [low, high], btype='band')
    
    return lfilter(iir_numer, iir_denom, data)

def bandpass_data(data, lowcut, highcut, sampling_rate, bandpass_order):
    multiplier = 8
    bandpass_data = []
    for channel in range(0, len(data)):
        new_channel = np.tile(np.append(data[channel], np.flip(data[channel], -1)), int(multiplier / 2))
        bandpassed_channel = bandpass_filter(new_channel, lowcut, highcut, sampling_rate, bandpass_order)
        lower_bound = len(data[channel]) * int(multiplier / 2)
        upper_bound = len(data[channel]) * (int(multiplier / 2) + 1)
        bandpass_data.append(bandpassed_channel[lower_bound : upper_bound])

    return bandpass_data

# preprocess steps: data[channel] = data[channel] - np.mean(data[channel]), data = bandpass_data(normalize_data_buffer, num_sensors, 8, .1, 15, sampling_rate, 2)
def detect_Brow(data, artifact_label):
    return_brow_up = False
    return_brow_down = False
    ch2_ch3_test = (abs(np.max(data[1])) * abs(np.min(data[1])) + abs(np.max(data[2])) * abs(np.min(data[2])))
    ch1_ch4_test = (abs(np.max(data[0])) * abs(np.min(data[0])) + abs(np.max(data[3])) * abs(np.min(data[3])))
    max_min_ratio = ch2_ch3_test / ch1_ch4_test

    if (ch2_ch3_test / 10000) > 20:
        if (ch2_ch3_test / 10000) < 100:
            return_brow_up = True
        else:
            return_brow_down = True

    return return_brow_up, return_brow_down

# preprocess steps: data[channel] = data[channel] - np.mean(data[channel]), data = bandpass_data(normalize_data_buffer, num_sensors, 8, .1, 15, sampling_rate, 2)
def detect_Wink(data, artifact_label):
    return_left_wink = False
    return_right_wink = False
    left_test_ratio = ((np.max(data[0]) * np.max(data[1])) + (np.min(data[0]) * np.min(data[1]))) / 2
    right_test_ratio = ((np.max(data[2]) * np.max(data[3])) + (np.min(data[2]) * np.min(data[3]))) / 2
    final_wink_test_ratio = left_test_ratio / right_test_ratio
    
    if final_wink_test_ratio > 8:
        return_left_wink = True
    elif final_wink_test_ratio < .2:
        return_right_wink = True
    else:
        return_left_wink = False
        return_right_wink = False
            
    return return_left_wink, return_right_wink
