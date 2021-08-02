const isString = require('lodash.isstring');
const { curly } = require('node-libcurl');
const path = require('path');
const { actionValue } = require('./processMetrics');

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
    const results = await Promise.allSettled(dispatches.map(dispatchWebhook));
    console.log(
      'function errors',
      results.filter((r) => r.reason)
    );
  } catch (error) {
    console.error(error);
  }
  res.sendStatus(200);
};

const dispatchWebhookThunk = (json) => async (dispatch) => {
  const { action, endpoints, valueType, value } = dispatch;
  if (!endpoints?.length) return 'OK';
  const expectedValue = normalizeValue(value, valueType);
  const results = await Promise.allSettled(
    endpoints.map(async ({ url, mode }) => {
      let endpoint = url;
      if (mode === 'GET') {
        endpoint = path.join(endpoint, action);
        if (valueType === 'value') endpoint = path.join(endpoint, value);
        else if (shouldAbortGet({ action, json, expectedValue, valueType }))
          return 'OK';
        console.log('get calling', endpoint);
        const { statusCode, data } = await curly.get(endpoint);
        console.log(statusCode, data);
        return statusCode;
      }
      if (shouldAbortPost({ action, json, expectedValue, valueType }))
        return 'OK';
      console.log('post calling', endpoint);
      const options = {
        httpHeader: [
          'Content-Type: application/json',
          'Accept: application/json',
        ],
        postFields: formatPostFields({ action, json, valueType }),
      };
      const { statusCode, data } = await curly.post(endpoint, options);
      console.log(statusCode, data);
      return statusCode;
    })
  );
  console.log(
    'dispatch errors',
    results.filter((r) => r.reason)
  );
  // TODO: log errors
  return results;
};

const normalizeValue = (value, valueType) => {
  if (valueType === 'boolean')
    return isString(value) ? value === 'true' : Boolean(value);
  return value;
};

const shouldAbortGet = ({ action, json, expectedValue, valueType }) => {
  let aborts = true;
  try {
    const result = normalizeValue(actionValue(action, json), valueType);
    aborts = result !== expectedValue;
  } catch (error) {
    console.error(error);
  }
  return aborts;
};

const shouldAbortPost = ({ action, json, expectedValue, valueType }) => {
  let aborts = false;
  if (valueType === 'boolean')
    aborts = shouldAbortGet({ action, json, expectedValue, valueType });
  return aborts;
};

const formatPostFields = ({ action, json, valueType }) => {
  switch (valueType) {
    case 'boolean':
    case 'value':
      return JSON.stringify({
        data: { value: normalizeValue(actionValue(action, json), valueType) },
      });
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
