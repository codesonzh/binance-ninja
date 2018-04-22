// from settings.js import EXTRA_BALANCE_COLUMNS, DONATION_CONFIG, SETTINGS,
// loadSettings, saveSettings, onSettingsChanged.
// from websocket.js import WS.setupWebSocket.

(function() {
  var ninja = new Ninja({
    api: new BinanceApi()
  });

  if (Util.getPagePath().match(/userCenter\/balances\.html.*/)) {
    ninja.init();
  }
})();  // Scope isolation.
