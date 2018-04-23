// import BinanceApi, Util, State

function BalanceRow($row) {
  var self = this;
  $row.children().each(function() {
    var $cell = $(this);
    $cell.get(0).classList.forEach(function(className) {
      if (className.indexOf("-") >= 0) {
        return;
      }
      (function($cell) {
        self[className] = function(def) {
          return $cell.text() || def;
        }
      })($cell);
    });
  });
}

function Ninja(options) {
  this.api = options.api;
  this.page = options.page;
  this.settings = null;
  this.state = new State({
    loading: false,
    // The value of BTC in USDT.
    btcValue: null,
    // Whether the UI is getting updated.
    digesting: false,
    // Mapping of coin symbol to it's ticker BTC price.
    btcPriceOf: {},
    // Mapping fo coin symbol to it's ticker USDT price.
    usdtPriceOf: {},
  });
}

Ninja.prototype.formatCell = function(mixed) {
  if (typeof mixed == 'undefined' || mixed === null) {
    return 'n/a';
  }

  if (typeof mixed != 'object') {
    return mixed;
  }

  var cellData = mixed;
  var displayValue = 'n/a';

  if (cellData.format == 'USD') {
    displayValue = '$ ' + (cellData.value * 1.0).toFixed(2);
  } else {
    displayValue = (cellData.value * 1.0).toFixed(8);
  }

  if (cellData.isMarket) {
    displayValue =
        '<strong title="' + cellData.title + '">' + displayValue + '</strong>';
  } else {
    displayValue =
        '<span title="' + cellData.title + '">' + displayValue + '</span>';
  }

  return displayValue;
}

Ninja.prototype.initUi = function() {
  $("body").addClass("binance-ninja-body");
}

Ninja.prototype.addColumn = function(options) {
  var ninja = this;
  var options = Object.assign({
    title: 'Header',
    key: 'cellClass',
    deps: {},
    compute: function(row, state) {},
    visible: false
  }, options);

  var $columnHeader = ninja.page.createColumn();
  $columnHeader.addClass(options.key);
  $columnHeader.html(options.title);
  $columnHeader.insertBefore(ninja.page.getPivotColumnHeader());

  ninja.page.getRows().each(function() {
    var $row = $(this);
    var $cell = ninja.page.createCell();
    $cell.addClass(options.key);
    $cell.insertBefore(ninja.page.getPivotCell($row));

    var updateCell = ninja.state.createLockedHandler('digesting', function() {
      $cell.html(
          ninja.formatCell(options.compute(balanceRow, ninja.state)));
    });

    if (options.deps.state) {
      for (let stateDep of options.deps.state) {
        ninja.state.addEventListener(stateDep, updateCell);
      }
    }

    if (options.deps.row) {
      $row.bind("DOMSubtreeModified", updateCell);
    }

    var balanceRow = new BalanceRow($row);
    $cell.html('...');
  });

  $(".binance-ninja." + options.key).toggleClass(
      "binance-ninja-hidden", !options.visible);
}

Ninja.prototype.initColumns = function(settings) {
  var ninja = this;

  EXTRA_BALANCE_COLUMNS.forEach(function(col) {
    if (col.compute) {
      ninja.addColumn(Object.assign(
          col,
          {visible: settings.balance_column_visibility[col.key]}));
    }
  });
}

Ninja.prototype.applySettings = function(settings) {
  var visibility = settings.balance_column_visibility;
  for (var key in visibility) {
    var $el = $(".binance-ninja." + key);
    if ($el.length == 0)
      continue;

    $el.toggleClass("binance-ninja-hidden", !visibility[key]);
  }
}

/** Initializes the Ninja. */
Ninja.prototype.init = function() {
  var ninja = this;
  Util.log("Started.");

  var promiseChain = [];

  ninja.state.setLoading(true);

  promiseChain.push(
    loadSettings().then(function(settings) {
      ninja.settings = settings;
      Util.log("Loaded settings");
    }));

  promiseChain.push(
      ninja.api.convert({
        from: 'BTC',
        to: 'USDT',
        amount: '1'
      }).then(function(r) {
        Util.log("Lodeded BTC value");
        ninja.state.setBtcValue(r.price);
      }));

  promiseChain.push(
      ninja.api.getTickerPrices().then(function(r) {
        ninja.state.setBtcPriceOf(ninja.api.buildPriceMap(r, 'BTC'));
        ninja.state.setUsdtPriceOf(ninja.api.buildPriceMap(r, 'USDT'));
        Util.log("Loaded price maps");
      }));

  ninja.page.addEventListener('DOMContentLoaded', function() {
    ninja.initUi();
  });

  promiseChain.push(
      new Promise(function(resolve, reject) {
        ninja.page.addEventListener('BalancesLoaded', function() {
          ninja.initColumns(ninja.settings);
          resolve();
          Util.log("Initiliazed columns.");
        });
      }));

  ninja.page.run();

  Promise.all(promiseChain).then(function() {
    Util.log("Initial loading complete.");
    ninja.state.setLoading(false);
  });

  onSettingsChanged(ninja.applySettings.bind(ninja));
}
