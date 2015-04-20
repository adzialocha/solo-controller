(function(window, UI, undefined) {

  UI.Component.Toggle = React.createClass({

    displayName: 'Toggle',

    getDefaultProps: function() {
      return {
        label: '',
        color: UI.COLOR.GREEN,
        id: undefined,
        onStatusChange: function() {
          return false;
        }
      };
    },

    getInitialState: function() {
      return {
        status: false,
        active: false,
        color: this.props.color,
        label: this.props.label
      };
    },

    componentWillReceiveProps: function(nProps) {
      this.setState(nProps);
    },

    onTouchStart: function() {
      this.setState({ active: true });
    },

    onTouchEnd: function($event) {

      var newStatus = ! this.state.status;

      this.setState({ active: false, status: newStatus });

      if (this.props.onStatusChange && typeof this.props.onStatusChange === 'function') {
          this.props.onStatusChange(this.props.id, newStatus);
      }

    },

    render: function() {

      var activeStyle = this.state.active ? ' active' : '';
      var statusStyle = this.state.status ? ' on' : ' off';

      return React.DOM.button({
        className: 'button toggle' + activeStyle + statusStyle + ' ' + this.state.color,
        onTouchStart: this.onTouchStart,
        onTouchEnd: this.onTouchEnd
      }, this.state.label);

    }

  });

})(window, window.UI);
