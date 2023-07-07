const express = require("express");
const app = express();

require('dotenv').config();

app.listen(4000, () => console.log('listening on port 4000.'));