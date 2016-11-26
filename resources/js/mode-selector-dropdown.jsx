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
    }
    this.handleClick = this.handleClick.bind(this);
    // this.handleItemClick = this.handleItemClick.bind(this);
  }

  handleClick(event) {
    console.log('clicked');
    console.log(event);
    event.preventDefault();
  }

  
  render() {
    var ddClass = classNames({
        'dropdown': true
    });
    var ddiClass = classNames({
        'dropdown-item': true
    });    
    var handleItemClick = function(event, target) {
      console.log('item clicked');
      console.log(event);
      console.log(target);
      // navigableShow();
      // event.preventDefault();
    };
    
    return (
      <Dropdown className={ddClass} color="primary" label="Menu" onClick={this.handleClick}>
        {this.state.items.map(function(item, index) {
          return (
            <DropdownItem key={index} className={ddiClass} data-target={item.target} onClick={handleItemClick}>{item.label}</DropdownItem>
          );
        })}
      </Dropdown>
    );
  }
}

ReactDOM.render(<ModeSelectorDropdown />, document.getElementById('mode-selector-dropdown'));