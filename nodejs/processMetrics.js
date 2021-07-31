/**
 * Provides some utility functions for interpreting the JSON blob from metrics
 * API calls forwarded through the metrics app over webhooks.
 */

const didBlink = (json) => {
    return Boolean(json.action.value.blink.blink);
}

const didWink = (json) => {
    return Boolean(json.action.value.wink.wink);
}

const didMoveEye = (json) => {
    return Boolean(json.action.value.eye.eye);
}

const processMetricsData = (json, messageType) => {
    switch(messageType) {
        case 'blink': return didBlink(json);
        case 'wink': return didWink(json);
        case 'eye': return didMoveEye(json);
    }
}

module.exports = {
    didBlink,
    didWink,
    didMoveEye,
    processMetricsData,
};
