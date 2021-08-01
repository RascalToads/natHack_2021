/**
 * npm install express
 * node mocke_server.js
 */

const express = require('express')
const bodyParser = require('body-parser')

const port = 3000
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/', (req, res) => {
  if (req.body.type === 'blink') {
    console.log('blink', req.body.action.value);
  }
  else if (req.body.type === 'brow-up') {
    console.log('brow-up', req.body.action.value);
  }
  else if (req.body.type === 'brow-down') {
    console.log('brow-down', req.body.action.value);
  }
  else if (req.body.type === 'eye') {
    console.log('eye', req.body.action.value);
  }
  else if (req.body.type === 'wink-left') {
    console.log('wink-left', req.body.action.value);
  }
  else if (req.body.type === 'wink-right') {
    console.log('wink-right', req.body.action.value);
  }
  else if (req.body.type === 'concentration') {
    console.log('concentration', req.body.action.value);
  }
  else if (req.body.type === 'percent-concentration') {
    console.log('percent-concentration', req.body.action.value);
  }
  else if (req.body.type === 'artifact-detect') {
    console.log('artifact', req.body.action.value);
  }
  else if (req.body.type === 'bandpower') {
    console.log('bandpower', req.body.action.value);
  }
  res.status(200);
  res.send('success');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
