const { curly } = require('node-libcurl');
const path = require('path');
const { processMetricsData } = require('./processMetrics');

/*
id: 0, 
name: "something",
data: {
  'blink': {
    action: 'blink, eye-movement, brow-up, brow-down, 
    outputs: [
      {
        mode: "GET | POST", 
        endpoint: "localhost:3000", 
      },
    ], 
    valueType: 'Boolean, Number, Raw',
    value: true, false, null
  }, 
}
*/
const dispatchWebhooks = async (req, res) => {
  const { context, body: json } = req;
  try {
    const dispatches = Object.values(context?.data ?? {});
    const dispatchWebhook = dispatchWebhookThunk(json);
    Promise.allSettled(dispatches.map(dispatchWebhook));
  } catch (error) {
    console.error(error);
  }
  res.sendStatus(200);
};

const dispatchWebhookThunk = (json) => async (dispatch) => {
  const { action, outputs, valueType, value } = dispatch;
  if (!outputs?.length) return 'OK';
  const results = await Promise.allSettled(
    outputs.map(({ endpoint, mode }) => {
      let url = endpoint;
      if (mode === 'GET') {
        url = path.join(url, action);
        if (valueType === 'Number') url = path.join(url, value);
        else if (shouldAbort({ action, json, value })) return 'OK';
        return curly.get(url);
      }
      const options = {
        method: mode,
        postFields: JSON.stringify(json),
      };
      return curly.post(url, options);
      // const { statusCode, data } = await curly.post(
    })
  );
  return results;
};

const shouldAbort = ({ action, json, value: expectedValue }) => {
  let aborts = true;
  try {
    const actionState = processMetricsData(json, action);
    aborts = actionState !== expectedValue;
  } catch (error) {
    console.error(error);
  }
  return aborts;
};

module.exports = {
  dispatchWebhooks,
  dispatchWebhookThunk,
  shouldAbort,
};
