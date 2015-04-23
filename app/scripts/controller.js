(function(window, undefined) {

  var SMALLEST_SUBDIVISION = 128;
  var DEFAULT_BPM = 120;

  // session

  var _active, _cells, _bpm, _timeout, _count;

  var _callback, _sceneCallback;

  function Cell() {
    this.active = false;
    this.treshold = 0;
    this.frequency = [];
  }

  Cell.prototype.toggle = function() {
    this.active = ! this.active;
  };

  // private

  function _init(eCellCount) {

    var i;

    _bpm = DEFAULT_BPM;
    _cells = [];

    for (i = 0; i < eCellCount; i++) {
      _cells.push(new Cell());
    }

  }

  function _note(eDuration) {

    var newState;

    _cells.forEach(function(eItem, eIndex) {

      // found allowed duration

      if (eItem.frequency.indexOf(eDuration) > -1) {

        // is there a chance we change the state?

        if (Math.random() < eItem.treshold / 100) {
          newState = true;
        } else {
          newState = false;
        }

        if (newState != eItem.active) {

          eItem.toggle();

          if (_callback) {
            _callback(eIndex, eItem.active);
          }

        }

      }

    });

  }

  function _start() {

    if (_active) {
      _timeout = window.setTimeout(_tick, (60000 / _bpm) / SMALLEST_SUBDIVISION);
    }

  }

  function _tick() {

    var i;

    if (_count % SMALLEST_SUBDIVISION === 0) {
      _count = 0;
    }

    for (i = 1; i <= SMALLEST_SUBDIVISION; i = i * 2) {
      if (_count % i === 0) {
        _note(SMALLEST_SUBDIVISION / i);
      }
    }

    _start();

    _count++;

  }

  function _stop() {
    _count = 0;
    _clear();
  }

  function _clear() {
    window.clearTimeout(_timeout);
  }

  // public

  function Controller(eCellCount) {
    _active = false;
    _init(eCellCount);
  }

  Controller.prototype.setActiveState = function(eStatus) {

    _active = eStatus;

    if (_active) {
      _count = 0;
      _start();
    } else {
      _stop();
    }

  };

  Controller.prototype.setBPM = function(eValue) {
    _bpm = eValue;
    if (_active) {
      _stop();
      _start();
    }
  };

  Controller.prototype.setTreshold = function(eIndex, eValue) {
    _cells[eIndex].treshold = eValue;
  };

  Controller.prototype.setFrequency = function(eIndex, eValue) {
    _cells[eIndex].frequency = eValue;
  };

  Controller.prototype.setCellState = function(eIndex, eStatus) {
    _cells[eIndex].active = eStatus;
  };

  Controller.prototype.registerCallback = function(eFunction) {
    _callback = eFunction;
  };

  Controller.prototype.registerSceneCallback = function(eFunction) {
    _sceneCallback = eFunction;
  };

  Controller.prototype.loadScene = function(eSceneData) {

    eSceneData.cells.forEach(function(eItem, eIndex) {
      _cells[eIndex] = new Cell();
      _cells[eIndex].active = eItem.active;
      _cells[eIndex].frequency = eItem.frequency;
      _cells[eIndex].treshold = eItem.treshold;
    });

    _bpm = eSceneData.bpm;

    if (_active) {
      _stop();
      _start();
    }

    if (_sceneCallback) {
      _sceneCallback(_cells, _bpm);
    }

  };

  Controller.prototype.getScene = function() {
    return {
      cells: _cells,
      bpm: _bpm
    };
  };

  Controller.prototype.resetScene = function() {
    _init(_cells.length);
    if (_sceneCallback) {
      _sceneCallback(_cells, _bpm);
    }
  };

  window.Controller = window.Controller || Controller;

})(window);
