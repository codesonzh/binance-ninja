function State(state) {
  var self = this;
  Util.attachEventSupport(this);
  for (var key in state) {
    (function(key) {
      var getterName = key;
      var setterName = "set" + key.capitalize();
      self[getterName] = function(def, mapDef) {
        if (!(key in state)) {
          return def;
        } else if (state[key] != null && typeof state[key] == 'object' &&
                   typeof def != 'undefined') {
          return state[key][def] || mapDef;
        } else {
          return state[key];
        }
      }
      self[setterName] = function(mixed, atKeyValue) {
        if (typeof state[key] == 'object' && typeof atKeyValue != 'undefined') {
          var oldValue = state[key][atKeyValue];
          state[key][mixed] = atKeyValue;
          self.dispatchEvent(
              key,
              {
                key: mixed,
                value: atKeyValue,
                oldValue: oldValue,
                eventName: key
              });
        } else {
          var oldValue = state[key];
          state[key] = mixed;
          self.dispatchEvent(
              key, {value: mixed, oldValue: oldValue, eventName: key});
        }
      }
      self.listeners[key] = [];
    })(key);
  }
}

State.prototype.createLockedHandler = function(lockName, handler) {
  var self = this;
  var setterName = "set" + lockName.capitalize();
  return function() {
    if (!self[lockName]()) {
      self[setterName](true);
      handler();
      self[setterName](false);
    }
  };
}
