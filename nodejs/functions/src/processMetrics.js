/**
 * Provides some utility functions for interpreting the JSON blob from metrics
 * API calls forwarded through the metrics app over webhooks.
 */

const didBlink = (json) => Boolean(json?.action?.value?.blink?.blink);

const didWink = (json) => Boolean(json?.action?.value?.wink?.wink);

const didMoveEye = (json) => Boolean(json?.action?.value?.eye?.eye);

const processMetricsData = (json, messageType) => {
  switch (messageType) {
    case 'blink':
      return didBlink(json);
    case 'wink':
      return didWink(json);
    case 'eye':
      return didMoveEye(json);
    default:
      throw new Error('Unsupported Message');
  }
};

module.exports = {
  didBlink,
  didWink,
  didMoveEye,
  processMetricsData,
};
