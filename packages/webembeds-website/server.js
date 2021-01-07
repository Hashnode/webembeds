const express = require('express');

const app = express();
const port = 3000;
const controllers = require('./controllers/api.controller');

app.get('/oembed', controllers.handleOEmbed);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Webembeds app listening at http://localhost:${port}`);
});
