#8/1 JG
from typing import Any, Dict, List
import requests
import argparse
import pprint
import time
import math
import sys
import numpy as np
from helperFuncs import *
from pylsl import StreamInlet, StreamOutlet, resolve_stream, local_clock, StreamInfo

import call_server

np.set_printoptions(threshold=sys.maxsize)

# define petal api metrics call
metricsCall = ['bandpower', 'eye', 'blink', 'artifact_detect']

# variables
chunk_length = 192
sampling_rate = 256
num_sensors = 4
sample_counter = 0
data_buffer = np.zeros([num_sensors, sampling_rate])

# define some current and "last" variables
current_concentration = False
current_percent_concentration = 0
last_api_average_bandpower = 0
last_wink_left = False
last_wink_right = False
last_last_wink_left = False
last_last_wink_right = False
last_brow_up = False
last_brow_down = False

# api parser
parser = argparse.ArgumentParser()
parser.add_argument('-k', '--api_key', type=str, required=True, help='API key for the Petal Metrics API')
args = parser.parse_args()

# get lsl stream from petal gui
print("looking for an EEG stream...")
streams = resolve_stream('type', 'EEG')
inlet = StreamInlet(streams[0])

# get samples
while True:
    sample, timestamp = inlet.pull_chunk(timeout=2, max_samples = chunk_length)
    sample = np.asarray(sample).T
    for channel in range(0, num_sensors):
        data_buffer[channel] = np.roll(data_buffer[channel], -chunk_length)
        for newSample in range(0, chunk_length):
            data_buffer[channel][len(data_buffer[channel])-chunk_length+newSample] = sample[channel][newSample]
            
#call api
    finalDataAPI = np.asarray(data_buffer).tolist()
    api_output = request_metrics(api_key=args.api_key, eeg_data=finalDataAPI, metrics=metricsCall,)
    print(api_output)
    eye = api_output['eye']['eye']
    blink = api_output['blink']['blink']
    artifact_label = [api_output['artifact_detect']['channel1'], api_output['artifact_detect']['channel2'], api_output['artifact_detect']['channel3'], api_output['artifact_detect']['channel4']]
##    pprint.pprint(api_output)
    
# preprocess data by normalizing then bandpass filtering
    normalize_data_buffer = np.zeros([num_sensors, len(data_buffer[0])])
    for channel in range(0, num_sensors):
        normalize_data_buffer[channel] = data_buffer[channel] - np.mean(data_buffer[channel])
    normalize_data_buffer_bandpass = bandpass_data(normalize_data_buffer, .1, 15, sampling_rate, 2)
    
# first get wink left and wink right and add to artifact label
    current_wink_left, current_wink_right = detect_Wink(normalize_data_buffer_bandpass, 5)
    if current_wink_right == True:
        if (last_wink_right == True) or (last_last_wink_right == True):
            current_wink_right = False
        else:
            artifact_label[2] = "wink_right"
            artifact_label[3] = "wink_right"
    if current_wink_left == True:
        if (last_wink_left == True) or (last_last_wink_left == True):
            current_wink_left = False
        else:
            artifact_label[0] = "wink_left"
            artifact_label[1] = "wink_left"

# calculate brow labels: brow_up and brow_down
    current_brow_up, current_brow_down = detect_Brow(normalize_data_buffer_bandpass, artifact_label)
    if current_brow_up == True or current_brow_down == True:
        if last_brow_up == True or last_brow_down == True:
            current_brow_up = False            
            current_brow_down = False
    # fix the brows: if there is a wink, we default to winks, if not then we go with brow
    if current_brow_up == True:
        if current_wink_left == True or current_wink_right == True:
            current_brow_up = False
    if current_brow_down == True:
        if current_wink_left == True or current_wink_right == True:
            current_brow_down = False
    # add brow_up and brow_down to artifact label
    if current_brow_up == True:
        artifact_label[1] = "brow_up"
        artifact_label[2] = "brow_up"
    if current_brow_down == True:
        artifact_label[1] = "brow_down"
        artifact_label[2] = "brow_down"

# if too many artifacts, don't do bandpower
    if artifact_label.count("good") < 2 or current_brow_down == True:
        api_average_bandpower = last_api_average_bandpower

    # get api bandpower, calculate average, clean bad data, convert from ratio to percentage, set threshold for concentration bool
    else:                                       
        api_average_bandpower = np.zeros(4)
        for band in range(0, 4):
            for channel in range(0, num_sensors):
                this_channel = str("'channel" + str(channel + 1) + "'")
                api_average_bandpower[band] += api_output['bandpower'][str('channel' + str(channel + 1))][str(band)]
        api_average_bandpower = api_average_bandpower / num_sensors
        if np.min(api_average_bandpower) < 10:
            for channel in range(0, num_sensors):
                if api_average_bandpower[channel] > 10:
                    api_average_bandpower[channel] = np.min(api_average_bandpower)
        current_ratio_concentration = api_average_bandpower[2] / api_average_bandpower[3]
        last_api_average_bandpower = api_average_bandpower
        current_percent_concentration = abs(np.log10(current_ratio_concentration) * 100)
        if current_percent_concentration > 25:
            current_concentration = False
        else:
            current_concentration = True

    # update "last" variables
    last_brow_up = current_brow_up
    last_brow_down = current_brow_down    
    last_last_wink_left = last_wink_left
    last_last_wink_right = last_wink_right
    last_wink_left = current_wink_left
    last_wink_right = current_wink_right

    # print output
    sample_counter += 1
    print(str(sample_counter)
          + ", blink: " + str(blink)
          + ", eye: " + str(eye)
          + ", brow_up: "
          + str(current_brow_up)
          + ", brow_down: "
          + str(current_brow_down)
          + ", wink_left: "
          + str(current_wink_left)
          + ", wink_right: "
          + str(current_wink_right)
          + ", concentration: "
          + str(current_concentration)
          + ", percent_concentration: "
          + str(round(current_percent_concentration, 2)))

    if isinstance(blink, str):
        if blink == 'True':
            blink = True
        else:
            blink = False
    if isinstance(eye, str):
        if eye == 'True':
            eye = True
        else:
            eye = False

    call_server.make_all_calls(
        brow_up=current_brow_up,
        brow_down=current_brow_down,
        blink=blink,
        eye=eye,
        concentration=current_concentration,
        wink_left=current_wink_left,
        wink_right=current_wink_right,
        percent_concentration=current_percent_concentration,
    )

    
