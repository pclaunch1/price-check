const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname,'archive')))

app.get('/', (req, res) => res.sendFile('./archive/index.html'));

app.listen(port, () => console.log(`Express app running on port ${port}!`));