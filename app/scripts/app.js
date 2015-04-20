(function(window, React, UI, Controller, Interface, undefined) {

  // configuration

  var MATRIX_X_ROWS = [ 'MUTE', 'LP', 'OCT', 'HP', 'COMP', 'RVB' ];
  var MATRIX_Y_ROWS = [ 'DI', 'C1', 'C2' ];

  var VIEW_IDS = [ 'view-main', 'view-frequency', 'view-treshold', 'view-setup' ];

  var INITIAL_BPM = 120;

  var FREQUENCY_SELECTOR_OPTIONS = [
    { label: '1',   value: 1, },
    { label: '2',   value: 2, },
    { label: '4',   value: 4, },
    { label: '8',   value: 8, },
    { label: '16',  value: 16 },
    { label: '32',  value: 32 },
    { label: '64',  value: 64 },
    { label: '128', value: 128 }
  ];

  // modules

  var _controller, _interface;

  // private

  var _navigationElems = [];
  var _currentView = 0;

  var _mainViewMatrixElem, _frequencyMatrixElem, _tresholdMatrixElem;

  function _updateNavigationView(eIndex) {

    document.getElementById(VIEW_IDS[_currentView]).style.display = 'none';
    document.getElementById(VIEW_IDS[eIndex]).style.display = 'block';

    _navigationElems[_currentView].setState({ status: false });
    _navigationElems[eIndex].setState({ status: true });

    _currentView = eIndex;

  }

  function _renderView() {

    React.render(
      React.createElement(UI.Component.Toggle, {
        label: 'ACTIVE',
        onStatusChange: _onMainActiveStatusChange
      }),
      document.getElementById('main-active-state')
    );

    React.render(
      React.createElement(UI.Component.Slider, {
        color: UI.COLOR.YELLOW,
        min: 40,
        max: 200,
        value: INITIAL_BPM,
        onStatusChange: _onBPMSliderChange
      }),
      document.getElementById('main-bpm')
    );

    // navigation buttons

    _navigationElems.push(React.render(
      React.createElement(UI.Component.Toggle, {
        id: 0,
        label: 'MAIN',
        color: UI.COLOR.BLUE,
        onStatusChange: _updateNavigationView
      }),
      document.getElementById('button-goto-main')
    ));

    _navigationElems.push(React.render(
      React.createElement(UI.Component.Toggle, {
        id: 1,
        label: 'FREQUENCY',
        color: UI.COLOR.BLUE,
        onStatusChange: _updateNavigationView
      }),
      document.getElementById('button-goto-frequency')
    ));

    _navigationElems.push(React.render(
      React.createElement(UI.Component.Toggle, {
        id: 2,
        label: 'TRESHOLD',
        color: UI.COLOR.BLUE,
        onStatusChange: _updateNavigationView
      }),
      document.getElementById('button-goto-treshold')
    ));

    _navigationElems.push(React.render(
      React.createElement(UI.Component.Toggle, {
        id: 3,
        label: 'SETUP',
        color: UI.COLOR.RED,
        onStatusChange: _updateNavigationView
      }),
      document.getElementById('button-goto-setup')
    ));

    // matrix views

    var toggleProps, frequencySelectorProps, tresholdSliderProps;
    var i, x, y;

    toggleProps = [];
    frequencySelectorProps = [];
    tresholdSliderProps = [];

    i = 0;

    for (x = 0; x < MATRIX_X_ROWS.length; x++) {

      for (y = 0; y < MATRIX_Y_ROWS.length; y++) {

        toggleProps[i] = {
          label: '[' + MATRIX_X_ROWS[x] + '] ' + MATRIX_Y_ROWS[y],
          color: UI.COLOR.RED,
          id: i
        };

        frequencySelectorProps[i] = {
          id: i,
          label: '[' + MATRIX_X_ROWS[x] + '] ' + MATRIX_Y_ROWS[y],
          selectors: FREQUENCY_SELECTOR_OPTIONS
        };

        tresholdSliderProps[i] = {
          id: i,
          label: '[' + MATRIX_X_ROWS[x] + '] ' + MATRIX_Y_ROWS[y],
          min: 0,
          max: 100,
          value: 0
        };

        i++;

      }

    }

    _mainViewMatrixElem = React.render(
      React.createElement(UI.Component.Matrix, {
        elem: UI.Component.Toggle,
        cellProps: toggleProps,
        onStatusChange: _onCellStatusChange,
        x: MATRIX_X_ROWS.length,
        y: MATRIX_Y_ROWS.length
      }),
      document.getElementById('view-main')
    );

    _frequencyMatrixElem = React.render(
      React.createElement(UI.Component.Matrix, {
        elem: UI.Component.Selector,
        cellProps: frequencySelectorProps,
        onStatusChange: _onCellFrequencyChange,
        x: MATRIX_X_ROWS.length,
        y: MATRIX_Y_ROWS.length
      }),
      document.getElementById('view-frequency')
    );

    _tresholdMatrixElem = React.render(
      React.createElement(UI.Component.Matrix, {
        elem: UI.Component.Slider,
        cellProps: tresholdSliderProps,
        onStatusChange: _onCellTresholdChange,
        x: MATRIX_X_ROWS.length,
        y: MATRIX_Y_ROWS.length
      }),
      document.getElementById('view-treshold')
    );

  }

  // events

  function _onCellStatusChange(eCellIndex, eToggleStatus) {
    _controller.setCellState(eCellIndex, eToggleStatus);
  }

  function _onCellFrequencyChange(eCellIndex, eValue) {
    _controller.setFrequency(eCellIndex, eValue);
  }

  function _onCellTresholdChange(eCellIndex, eValue) {
    _controller.setTreshold(eCellIndex, eValue);
  }

  function _onMainActiveStatusChange(eToggleIndex, eToggleStatus) {

    var path, port;

    path = document.getElementById('setup-server-path').value;
    port = document.getElementById('setup-server-port').value;

    _controller.setActiveState(eToggleStatus);

    if (eToggleStatus) {
      _interface.start(path, port);
    } else {
      _interface.stop();
    }

  }

   function _onBPMSliderChange(eToggleIndex, eValue) {
    _controller.setBPM(eValue);
  }

  // public

  var app = {};

  app.init = function() {

    // view

    React.initializeTouchEvents(true);

    _renderView();
    _updateNavigationView(0);

    // modules

    _controller = new Controller(MATRIX_X_ROWS.length * MATRIX_Y_ROWS.length);
    _controller.setBPM(INITIAL_BPM);

    _controller.registerCallback(function(eIndex, eStatus) {

      _mainViewMatrixElem.setCell(eIndex, { status: eStatus });

      if (_interface.isConnected) {
        _interface.sendMessage(eIndex, eStatus);
      }

    });

    _interface = new Interface();

    _interface.registerCallback(function($event, eMessage) {

      if (eMessage === 'error') {
        window.alert('OSC CONNECTION ERROR\n' + 'an osc-error occurred');
      }

    });

  };

  window.app = window.app || app;

})(window, window.React, window.UI, window.Controller, window.Interface);
