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


String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}


Util.getPagePath = function() {
  var urlParts = window.location.href.split("/");
  return urlParts.splice(3).join("/");
}
