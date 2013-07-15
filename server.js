var httpSrv = require("./lib/ExpressHttp");
var topic = require("./lib/pubsub");

httpSrv.start();
console.log("Server is on PID ", process.pid)

// On SIGTERM (15), close server and exit process.
process.on("SIGTERM", function()
{
  console.log("SIGTERM: Stopping server.");
  process.exit();
});

// On SIGHUP (1), send refresh event.
process.on("SIGHUP", function()
{
  console.log("SIGHUP: sending refresh.");
  topic.pub("evt/push", { type: "rfs" });
});