const express = require("express");
const app = express();

require('dotenv').config();


// establish middle ware to monitor requests to server and response//
app.use((req, res, next) => {
  console.log("Path is " + req.path + " and method is " + req.method)
})

//routes /////////////////////////////
app.get('/', (req, res) => {
  res.json({mssg:'Route is / and method is ' + req.method})
}
);

app.listen(process.env.PORT, () => console.log('listening on port 4000.'));