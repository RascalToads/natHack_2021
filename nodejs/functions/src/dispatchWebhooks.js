const { curly } = require('node-libcurl');
const path = require('path');
const { processMetricsData } = require('./processMetrics');

/*
id: 0, 
name: "something",
data: {
  'blink': {
    action: 'blink, eye-movement, brow-up, brow-down, 
    endpoints: [
      {
        mode: "GET | POST", 
        url: "localhost:3000", 
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
    // TODO: log errors
    Promise.allSettled(dispatches.map(dispatchWebhook));
  } catch (error) {
    console.error(error);
  }
  res.sendStatus(200);
};

const dispatchWebhookThunk = (json) => async (dispatch) => {
  const { action, endpoints, valueType, value } = dispatch;
  if (!endpoints?.length) return 'OK';
  const results = await Promise.allSettled(
    endpoints.map(({ url, mode }) => {
      let endpoint = url;
      if (mode === 'GET') {
        endpoint = path.join(endpoint, action);
        if (valueType === 'Number') endpoint = path.join(endpoint, value);
        else if (shouldAbort({ action, json, value })) return 'OK';
        console.log('calling', endpoint);
        return curly.get(endpoint);
      }
      const options = {
        method: mode,
        postFields: JSON.stringify(json),
      };
      console.log('calling', endpoint);
      return curly.post(endpoint, options);
      // const { statusCode, data } = await curly.post(
    })
  );
  // TODO: log errors
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
