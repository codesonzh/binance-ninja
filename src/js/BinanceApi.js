// import Util

function BinanceApi(options) {
  var options = Object.assign(
      {
        fetch: fetch
      },
      typeof options != 'undefined' ? options : {});
  this.fetch = options.fetch;
}

BinanceApi.prototype.getTickerPrices = function() {
  return this.fetchJson('/api/v3/ticker/price');
}

BinanceApi.prototype.buildPriceMap = function(ticker, symbol) {
  var matchPattern = new RegExp('.*' + symbol + '$');
  var replacePattern = new RegExp(symbol + '$');
  return (
      ticker
      .filter(p => p.symbol.match(matchPattern))
      .reduce(
          (acc, p) => {
            acc[p.symbol.replace(replacePattern, '')] = p.price;
            return acc;
          },
          {}));
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
