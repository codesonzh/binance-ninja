function BinanceBalancesPage() {
  var self = this;
  Util.attachEventSupport(this);
}

BinanceBalancesPage.prototype.run = function() {
  var self = this;

  Util.pollCheckAndRunOnce(
      function() { return $("body").length > 0; },
      function() { self.dispatchEvent('DOMContentLoaded'); });

  Util.pollCheckAndRunOnce(
      function() { return $(".accountInfo-lists > li.td").length > 1; },
      function() { self.dispatchEvent('BalancesLoaded'); });
}


BinanceBalancesPage.prototype.getRows = function() {
  return $(".accountInfo-lists > li.td > .items");
}

BinanceBalancesPage.prototype.getPivotColumnHeader = function() {
  return $(".accountInfo-lists > li.th > .items > .action");
}

BinanceBalancesPage.prototype.getPivotCell = function($row) {
  return $row.find(".action");
}

BinanceBalancesPage.prototype.createColumn = function() {
  return $('<div class="binance-ninja f-right"></div>');
}

BinanceBalancesPage.prototype.createCell = function() {
  return $('<div class="binance-ninja f-right"></div>');
}
