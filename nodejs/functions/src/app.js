const cors = require('cors');
const express = require('express');
const { useContext } = require('./useContext');
const { dispatchWebhooks } = require('./dispatchWebhooks');

const app = express();

app.use(cors({ origin: true }));

app.get('/', (req, res) => res.send('WHC|'));
app.post('/:id', useContext, dispatchWebhooks);

module.exports = app;
