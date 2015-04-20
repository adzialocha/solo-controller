(function(window, UI, undefined) {

  UI.Component.Matrix = React.createClass({

    displayName: 'Matrix',

    getDefaultProps: function() {
      return {
        cellProps: [],
        onStatusChange: function() {
          return false;
        },
        x: 0,
        y: 0,
        elem: null
      };
    },

    getInitialState: function() {
      return {
        cellProps: this.props.cellProps
      };
    },

    _onStatusChange: function(tIndex, tStatus) {
      this.props.onStatusChange(tIndex, tStatus);
    },

    setCell: function(tIndex, tState) {

      var newCellProps;

      newCellProps = this.state.cellProps;

      Object.keys(tState).forEach(function(eKey) {
        newCellProps[tIndex][eKey] = tState[eKey];
      });

      this.setState({ cellProps: newCellProps });

    },

    render: function() {

      var _this = this;

      var matrixElems, matrixRow;
      var i, x, y, size;

      matrixElems = [];

      size = Math.sqrt(this.props.cellProps.length);
      i = 0;

      for (x = 0; x < this.props.x; x++) {

        matrixRow = [];

        for (y = 0; y < this.props.y; y++) {
          _this.state.cellProps[i].key = i;
          _this.state.cellProps[i].onStatusChange = _this._onStatusChange;
          matrixRow.push(React.createElement(_this.props.elem, _this.state.cellProps[i]));
          i++;
        }

        matrixElems.push(React.DOM.div({
          className: 'matrix__row',
          key: x,
        }, matrixRow));

      }

      return React.DOM.div({
        className: 'matrix',
      }, matrixElems);

    }

  });

})(window, window.UI);
