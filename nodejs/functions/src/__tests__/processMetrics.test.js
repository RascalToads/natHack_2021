/**
 * Some basic tests for checking the validity of json process functions.
 */

const { expect } = require('@jest/globals');
const {
  didBlink,
  didWink,
  didMoveEye,
  processMetricsData,
} = require('../processMetrics.js');

const TEST_DATA = {
  action: {
    value: {
      artifact_detect: {
        channel1: 'artifact',
        channel2: 'artifact',
        channel3: 'artifact',
        channel4: 'artifact',
      },
      bandpower: {
        channel1: {
          0: 'bad_data',
          1: 'bad_data',
          2: 'bad_data',
          3: 'bad_data',
        },
        channel2: {
          0: 'bad_data',
          1: 'bad_data',
          2: 'bad_data',
          3: 'bad_data',
        },
        channel3: {
          0: 'bad_data',
          1: 'bad_data',
          2: 'bad_data',
          3: 'bad_data',
        },
        channel4: {
          0: 'bad_data',
          1: 'bad_data',
          2: 'bad_data',
          3: 'bad_data',
        },
      },
      blink: { blink: 0 },
      eye: { eye: 0 },
    },
    time: 7899.9400702514295,
  },
  data: {
    id: 2,
    lsl_ts: 7899.9400702514295,
    unix_ts: 1627282075.085,
    lsl_eeg_fill_ts: 7899.9728038,
    lsl_api_call_ts: 7899.9729819,
    lsl_api_recv_ts: 7900.1405953,
    last_eeg_id: 639,
  },
  type: 'metricsJson',
};

test('didBlink', () => {
  const data = JSON.parse(JSON.stringify(TEST_DATA));
  data.action.value.blink.blink = 0;
  expect(didBlink(data)).toBeFalsy();
  expect(processMetricsData(data, 'blink')).toBeFalsy();
  data.action.value.blink.blink = 1;
  expect(didBlink(data)).toBeTruthy();
  expect(processMetricsData(data, 'blink')).toBeTruthy();
});

test('didWink', () => {
  const data = JSON.parse(JSON.stringify(TEST_DATA));
  data.action.value.wink = { wink: 0 };
  data.action.value.wink.wink = 0;
  expect(didWink(data)).toBeFalsy();
  expect(processMetricsData(data, 'wink')).toBeFalsy();
  data.action.value.wink.wink = 1;
  expect(didWink(data)).toBeTruthy();
  expect(processMetricsData(data, 'wink')).toBeTruthy();
});

test('didMoveEye', () => {
  const data = JSON.parse(JSON.stringify(TEST_DATA));
  data.action.value.eye.eye = 0;
  expect(didMoveEye(data)).toBeFalsy();
  expect(processMetricsData(data, 'eye')).toBeFalsy();
  data.action.value.eye.eye = 1;
  expect(didMoveEye(data)).toBeTruthy();
  expect(processMetricsData(data, 'eye')).toBeTruthy();
});
