function Util() {}

Util.buildQueryString = function(obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

Util.log = function() {
  var LOG_PREFIX = "[BinanceNinja]";
  var args = Array.prototype.slice.call(arguments);
  args.unshift(LOG_PREFIX);
  console.log.apply(console, args);
}

Util.getPagePath = function() {
  var urlParts = window.location.href.split("/");
  return urlParts.splice(3).join("/");
}

Util.pollCheckAndRunOnce = function(predicate, handler, period) {
  var checkInterval = setInterval(function() {
    if (predicate()) {
      clearInterval(checkInterval);
      handler();
    }
  }, period || 100);
}

Util.attachEventSupport = function(self) {
  self.listeners = {};

  self.addEventListener = function(eventName, handler) {
    var self = this;
    if (!(eventName in self.listeners)) {
      self.listeners[eventName] = [];
    }
    self.listeners[eventName].push(handler);
  };

  self.dispatchEvent = function(eventName, eventArgs) {
    var self = this;
    if (!(eventName in self.listeners)) {
      return;
    }
    for (let handler of self.listeners[eventName]) {
      handler(eventArgs);
    }
  };
}

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}
