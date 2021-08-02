const functions = require('firebase-functions');
const app = require('./src/app');

exports.webhooksconfig = functions.https.onRequest(app);
