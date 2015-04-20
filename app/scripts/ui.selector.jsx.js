(function(window, UI, undefined) {

  UI.Component.Selector = React.createClass({

    displayName: 'Selector',

    getDefaultProps: function() {
      return {
        label: '',
        color: UI.COLOR.GREEN,
        id: undefined,
        selectors: [],
        onStatusChange: function() {
          return false;
        }
      };
    },

    getInitialState: function() {
      return {
        selectedElements: [],
        label: this.props.label
      };
    },

    componentWillReceiveProps: function(nProps) {
      this.setState(nProps);
    },

    _onStatusChange: function(eValue, eStatus) {

      var idx;

      idx = this.state.selectedElements.indexOf(eValue);

      if (idx > -1) {
        this.state.selectedElements.splice(idx, 1);
      } else {
        this.state.selectedElements.push(eValue);
      }

      this.props.onStatusChange(this.props.id, this.state.selectedElements);

    },

    render: function() {

      var _this = this;

      var selectorElems;

      selectorElems = [];

      this.props.selectors.forEach(function(eItem, eIndex) {
        selectorElems.push(React.createElement(UI.Component.Toggle, {
          key: eIndex,
          label: eItem.label,
          color: _this.props.color,
          status: false,
          id: eItem.value,
          onStatusChange: _this._onStatusChange
        }));
      });

      return React.DOM.div({ className: 'selector' },
        React.DOM.div({ className: 'selector__label' }, this.state.label),
        React.DOM.div({ className: 'selector__buttons' }, selectorElems)
      );

    }

  });

})(window, window.UI);
