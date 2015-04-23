(function(window, OSC, undefined) {

  var OSC_PATH = '/param/';
  var OSC_SCENE_PATH = '/scene/'

  var DEFAULT_SERVER_PATH = 'localhost';
  var DEFAULT_SERVER_PORT = 8000;

  // private

  var _osc, _path, _port, _status;

  var _callback;

  function _call($event, eName) {

    if (_callback) {
      _callback($event, eName);
    }

  }

  function _start() {

    if (_status) {
      return false;
    }

    _osc.connect(_path, _port);

  }

  function _send(eIndex, eStatus) {

    var payload, msg;

    if (_status === undefined || _status === null) {
      return false;
    }

    payload = eStatus? 1.0 : 0.0;
    msg = new OSC.Message(OSC_PATH, eIndex, payload);

    _osc.send(msg);

  }

  function _sendScene(eSceneIndex) {

    var msg;

    if (_status === undefined || _status === null) {
      return false;
    }

    msg = new OSC.Message(OSC_SCENE_PATH, eSceneIndex);

    _osc.send(msg);

  }

  function _stop() {

    if (! _status) {
      return false;
    }

    _osc.disconnect();

  }

  // public

  function Interface() {

    _status = false;
    _osc = new OSC();

    _osc.on('open', function($event) {
      _status = true;
      _call($event, 'open');
    });

    _osc.on('close', function($event) {
      _status = false;
      _call($event, 'close');
    });

    _osc.on('error', function($event) {
      _status = false;
      _call($event, 'error');
    });

  }

  Interface.prototype.registerCallback = function(eCallback) {
    _callback = eCallback;
  };

  Interface.prototype.start = function(ePath, ePort) {

    _path = ePath || DEFAULT_SERVER_PATH;
    _port = ePort || DEFAULT_SERVER_PORT;

    return _start();

  };

  Interface.prototype.sendMessage = function(eIndex, eStatus) {
    _send(eIndex, eStatus);
  };

  Interface.prototype.sendScene = function(eSceneIndex) {
    _sendScene(eSceneIndex);
  };

  Interface.prototype.stop = function() {
    return _stop();
  };

  Interface.prototype.isConnected = function() {
    return _status;
  };

  window.Interface = window.Interface || Interface;

})(window, window.OSC);
