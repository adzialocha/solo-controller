(function(window, UI, undefined) {

  UI.Component.Slider = React.createClass({

    displayName: 'Slider',

    _active: false,

    getDefaultProps: function() {
      return {
        label: '',
        color: UI.COLOR.GREEN,
        min: 0,
        max: 100,
        id: undefined,
        value: 50,
        onStatusChange: function() {
          return false;
        }
      };
    },

    getInitialState: function() {
      return {
        value: this.props.value,
        offset: 0,
        width: 0
      }
    },

    componentDidMount: function() {
      this.setState({
        value: this.props.value,
        offset: this.getDOMNode().offsetLeft,
        width: this.getDOMNode().offsetWidth
      });
    },

    componentWillReceiveProps: function(nProps) {
      this.setState({
        value: this.props.value,
        offset: this.getDOMNode().offsetLeft,
        width: this.getDOMNode().offsetWidth
      });
    },

    onValueChange: function($event) {

      var position, percentage;
      var width, value;

      if ($event.touches) {
        position = $event.touches[0].clientX - this.state.offset;
      } else {
        position = $event.pageX - this.state.offset;
      }

      width = this.state.width;

      if (position >= 0 && position <= width) {

        percentage = position / width;
        value = Math.floor(this.props.min + (percentage * (this.props.max - this.props.min)))

        this.setState({
          value: value
        });

        this.props.onStatusChange(this.props.id, value);

      }

    },

    render: function() {

      var sliderInnerStyle;

      sliderInnerStyle = {
        width: (((this.state.value - this.props.min) / (this.props.max - this.props.min)) * this.state.width) + 'px'
      };

      return React.DOM.div({
          className: 'slider',
          onTouchStart: this.onValueChange,
          onTouchMove: this.onValueChange,
          onMouseDown: this.onValueChange
        },
        React.DOM.div({ className: 'slider__label' }, this.props.label),
        React.DOM.div({ className: 'slider__value' }, this.state.value),
        React.DOM.div({
          className: 'slider__inner ' + this.props.color,
          style: sliderInnerStyle
        })
      );

    }

  });

})(window, window.UI);
