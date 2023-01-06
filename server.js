/** Server startup for BizTime. */

const app = require('./app');

portNum = 3000;

app.listen(portNum, function () {
  console.log(`Listening on port : ${portNum}.  Enjoy!!`);
});
