const { curly } = require('node-libcurl');
const path = require('path');
const { getValue, processMetricsData } = require('./processMetrics');

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
        else if (shouldAbortGet({ action, json, value })) return 'OK';
        console.log('calling', endpoint);
        return curly.get(endpoint);
      }
      console.log('calling', endpoint);
      if (shouldAbortPost({ action, json, value, valueType })) return 'OK';
      const options = {
        method: mode,
        postFields: formatPostFields({ action, json, valueType }),
      };
      return curly.post(endpoint, options);
      // const { statusCode, data } = await curly.post(
    })
  );
  // TODO: log errors
  return results;
};

const shouldAbortGet = ({ action, json, value: expectedValue }) => {
  let aborts = true;
  try {
    const actionState = processMetricsData(json, action);
    aborts = actionState !== expectedValue;
  } catch (error) {
    console.error(error);
  }
  return aborts;
};

const shouldAbortPost = ({ action, json, value: expectedValue, valueType }) => {
  let aborts = false;
  if (valueType === 'boolean')
    aborts = shouldAbortGet({ action, json, value: expectedValue, valueType });
  return aborts;
};

const formatPostFields = ({ action, json, valueType }) => {
  switch (valueType) {
    case 'boolean':
      return Boolean(getValue(json, action));
    case 'value':
      return getValue(json);
    case 'json':
      return JSON.stringify(json);
    default:
      throw new Error('Unsupported POST configurations');
  }
};

module.exports = {
  dispatchWebhooks,
  dispatchWebhookThunk,
  shouldAbortGet,
  shouldAbortPost,
};
