var Events = require("events").EventEmitter;
var events = new Events();

exports.sub = subscribe;
function subscribe(topic, cb)
{
  events.addListener(topic, cb);
  return [topic, cb];
}
exports.subonce = subonce;
function subonce(topic, cb)
{
  events.once(topic, cb);
}
exports.unsub = unsub;
function unsub(handler)
{
  events.removeListener(handler[0], handler[1]);
}
exports.pub = pub;
function pub()
{
  return events.emit.apply(events, arguments);
}
