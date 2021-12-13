const express = require('express');
const app = express();

app.use(express.json());

const crawlRoute = require('./api/spider/crawl.routes');

app.use('/api/spider', crawlRoute);
app.use(express.static('public'));
const http = require('http').createServer(app);
const port = 2556;
http.listen(port, () => {
  console.log('Server is running on port: ' + port);
});
