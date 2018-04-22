// import Util

function BinanceApi(options) {
  var options = Object.assign(
      {
        fetch: fetch
      },
      typeof options != 'undefined' ? options : {});
  this.fetch = options.fetch;
}

BinanceApi.prototype.convert = function(options) {
  return this.fetchJson(
      "/exchange/public/convert?" + Util.buildQueryString(options));
}

BinanceApi.prototype.fetchJson = function() {
  return this.fetch.apply(null, arguments).then(function(response) {
    return response.json();
  });
}

// module.exports = BinanceApi
