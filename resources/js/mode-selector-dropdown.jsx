var classNames = require('classnames');
var React = require('react');
var ReactDOM = require('react-dom');
var Dropdown = require('muicss/lib/react/dropdown');
var DropdownItem = require('muicss/lib/react/dropdown-item');

class ModeSelectorDropdown extends React.Component {
  constructor() {
    super()
    this.state = {
      'items': [
        {
          'label': 'Map',
          'target': 'map_div'
        },
        {
          'label': 'Chat',
          'target': 'chat_div'
        },
        {
          'label': 'Profile',
          'target': 'profile_div'
        },
        {
          'label': 'Buy & Sell',
          'target': 'buy_sell_div'
        }
      ],
      'selected': 0
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(event) {
    event.preventDefault();
  }
  render() {
    var ddClass = classNames({
        'foo': true
    });
    var ddiClass = classNames({
        'foo': true
    });    
    return (
      <Dropdown className={ddClass} color="primary" label="Menu">
        {this.state.items.map(function(item, index) {
          return <DropdownItem key={index} className={ddiClass} onClick={this.handleClick}>{item.label}</DropdownItem>
        })}
      </Dropdown>
    );
  }
}

ReactDOM.render(<ModeSelectorDropdown />, document.getElementById('mode-selector-dropdown'));