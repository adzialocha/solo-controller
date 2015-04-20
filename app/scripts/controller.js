(function(window, undefined) {

  var SMALLEST_SUBDIVISION = 128;

  // session

  var _currentScene, _currentSet;

  var _active, _cells, _bpm, _timeout, _count;

  var _callback;

  function Cell() {
    this.active = false;
    this.treshold = 0;
    this.frequency = [];
  }

  Cell.prototype.toggle = function() {
    this.active = ! this.active;
  };

  // private

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

  // storage

  function _save() {
    if (_currentScene && _currentScene != 0 && _currentSet) {
      window.storage.saveSession(_currentSet, _currentScene, _cells);
    }
  }

  // public

  function Controller(eCellCount) {

    var i;

    _bpm = 120;
    _active = false;

    _cells = [];

    for (i = 0; i < eCellCount; i++) {
      _cells.push(new Cell());
    }

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
    _save();
  };

  Controller.prototype.setFrequency = function(eIndex, eValue) {
    _cells[eIndex].frequency = eValue;
    _save();
  };

  Controller.prototype.setCellState = function(eIndex, eStatus) {
    _cells[eIndex].active = eStatus;
    _save();
  };

  Controller.prototype.registerCallback = function(eFunction) {
    _callback = eFunction;
  };

  Controller.prototype.loadScene = function(eSceneData) {

    _currentSet = eSceneData.set;
    _currentScene = eSceneData.scene;

    _cells = eSceneData.cells;

    if (_active) {
      _stop();
      _start();
    }

  };

  Controller.prototype.initScene = function(eSetName, eSceneId) {
    _currentScene = eSceneId;
    _currentSet = eSetName;
  };

  window.Controller = window.Controller || Controller;

})(window);
