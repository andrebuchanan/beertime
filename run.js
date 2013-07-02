
// XXX Implement start / stop args. On detach save pid to file.
// Don't start if pid file is present. On stop read file, kill pid, delete file.
var fs = require("fs"),
    spawn = require("child_process").spawn,
    out = fs.openSync("./http.log", "w"),
    err = fs.openSync("./http.log", "a");

var server = process.argv[2] || "server.js",
    port = process.argv[3] || 8889;

// Detach server from terminal.
var child = spawn("node", [server, port], {
  detached: true,
  stdio: [ "ignore", out, err ]
});

console.log("Started HTTP server with PID " + child.pid);

child.unref();
process.exit();