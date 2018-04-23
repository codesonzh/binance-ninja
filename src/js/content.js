// from settings.js import EXTRA_BALANCE_COLUMNS, DONATION_CONFIG, SETTINGS,
// loadSettings, saveSettings, onSettingsChanged.
// import BinanceApi, BinanceBalancesPage

(function() {
  var ninja = new Ninja({
    api: new BinanceApi(),
    page: new BinanceBalancesPage()
  });

  if (Util.getPagePath().match(/userCenter\/balances\.html.*/)) {
    ninja.init();
  }
})();  // Scope isolation.
