/**
 * Provides some utility functions for interpreting the JSON blob from metrics
 * API calls forwarded through the metrics app over webhooks.
 */
const get = require('lodash/get');

const ACTIONS = [
  'artifact-detect',
  'eye',
  'bandpower',
  'blink',
  'metrics',
  'brow-down',
  'brow-up',
  'wink-left',
  'wink-right',
  'concentration',
  'percent-concentration',
];

const didAction = (key, json) => actionValue(key, json) !== undefined;
const actionValue = (key, json) => get(json, `action.value.${key}.${key}`);

module.exports = {
  ACTIONS,
  actionValue,
  didAction,
};
