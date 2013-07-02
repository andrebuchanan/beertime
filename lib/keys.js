
exports.monitor = monitor;
function monitor()
{
  var stdin = process.stdin;
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding("utf8");
  stdin.on("data", function(key)
  {
    if (key === "\u0003")
    {
      process.exit();
    }
  });
}
