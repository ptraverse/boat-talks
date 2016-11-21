var React = require('react');
var ReactDOM = require('react-dom');
var Dropdown = require('muicss/lib/react/dropdown');
var DropdownItem = require('muicss/lib/react/dropdown-item');

class ModeSelectorDropdown extends React.Component {
  render() {
    return (
      <Dropdown color="primary" label="Menu">
        <DropdownItem link="#/link1">Reveal Modal</DropdownItem>
        <DropdownItem>Option 2</DropdownItem>
        <DropdownItem>Option 3</DropdownItem>
        <DropdownItem>Option 4</DropdownItem>
      </Dropdown>
    );
  }
}

ReactDOM.render(<ModeSelectorDropdown />, document.getElementById('mode-selector-dropdown'));