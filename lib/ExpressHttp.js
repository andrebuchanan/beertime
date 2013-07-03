var express = require("express"),
    fs      = require("fs"),
    util    = require("util"),
    topic   = require("./pubsub");

// Framework? init.
var app = express().
  use(express.bodyParser()).
  use(express.logger("dev")).
  use(express.compress()).
  use(express.static("./client/", { maxAge: 1 })).
  use(express.cookieParser("v2+fq5o8$134321+tZ5kY7YkZpMssklda234")).
  use(express.cookieSession({
    key: "beerTime.sess",
    secret: "v2+fq5o8$134321+tZ5kY7YkZpMssklda234"
  })).
  use(express.session()).
  use(function(req, res, next)
  {
    // req.session.gricktime = "123";
    console.log(req.ip, req.signedCookies);
    next();
  });

var attendees = [];
// Load users file and parse contents.
var loadUsers = function()
{
  fs.readFile("./users.json", { encoding: "utf8" }, function(err, data)
  {
    if (err) return;
    attendees = JSON.parse(data);
    console.log(attendees);
  });
};
// On process exit, write users to file.
process.on("exit", function()
{
  console.log(attendees);
  fs.writeFileSync("./users.json", JSON.stringify(attendees));
});

// Get all attds
app.get("/att", function(req, res)
{
  res.json(attendees);
});
app.get("/att/:name", function(req, res)
{
  console.log(attendees[req.params.name]);
  res.json(attendees[req.params.name]);
});
// Add attendee
app.post("/att", function(req, res, next)
{
  if (!req.body.name) {
    res.send(404);
    return;
  }
  else
  {
    next();
  }
},
function(req, res)
{
  var name = req.body.name;
  newAtt = {
    name: name,
    comment: "",
    pub: true,
    shout: 1,
    shots: false,
    deleted: false
  };
  attendees[name] = newAtt;
  topic.pub("evt/push", {
    type: "att",
    att: attendees[name]
  });
  res.json(newAtt);
});
// Update attds
app.put("/att", function(req, res)
{
  console.log(req.body);
  var name = req.body.name;
  if (attendees[name])
  {
    attendees[name] = req.body;
    attendees[name].showCommentField = false;
    topic.pub("evt/push", {
      type: "att",
      att: attendees[name]
    });
    res.json(attendees[name]);
  }
  else
  {
    res.send(404);
  }
});
// Delete att.
app.delete("/att/:name", function(req, res)
{
  console.log(req.params.name);
  attendees[req.params.name].deleted = true;
  topic.pub("evt/push", {
    type: "del",
    att: attendees[req.params.name]
  });
  res.send(204);
});

var messages = [];
// Chatting
app.get("/chat", function(req, res)
{
  res.json(messages);
});
app.post("/chat", function(req, res)
{
  var message = req.body.message;
  var name = req.body.name || req.ip;
  if (!message)
  {
    res.send(404);
    return;
  }

  var obj = { message: message, name: name, date: new Date() };
  messages.push(obj);
  topic.pub("evt/push", {
    type: "chat",
    chat: obj
  });
  res.send(204);
});

// Event long poll thing.
app.get("/evt", function(req, res)
{
  console.log(new Date().toLocaleTimeString(), "received event request from ", req.ip);
  // These are async handles. When a handle fires, all must be shut down to avoid
  // sending the response twice.
  var tm, pushHandle, off = function()
  {
    if (pushHandle !== undefined) topic.unsub(pushHandle);
    if (tm !== undefined) clearTimeout(tm);
  };

  // By default respond after 30 seconds. No events.
  tm = setTimeout(function()
  {
    off(); // Remove all handles.
    console.log(new Date().toLocaleTimeString(), "sending event noop to ", req.ip);
    res.json({ type: "noop" });
  }, 30000);

  // Set up function for event push.
  pushHandle = topic.sub("evt/push", function(messages)
  {
    off(); // Remove all handles.
    console.log(new Date().toLocaleTimeString(), "sending event data to ", req.ip);
    res.json(messages);
  });
});

loadUsers();
// Start the server.
exports.start = start;
function start(args)
{
  // Port setup.
  var
    that = this,
    port = process.argv[2] || 80;

  app.listen(parseInt(port, 10));
  console.log("NodeJS Express HTTP server running on port ", port);
}

