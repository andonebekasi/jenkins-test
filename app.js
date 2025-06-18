const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (_, res) => res.send('Hello saya lagi testing  Azure App Service!'));

app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;
