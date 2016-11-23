'use strict';

var classNames = require('classnames');
var React = require('react');
var ReactDOM = require('react-dom');

class TestMapWidget extends React.Component {
    constructor() {
        super()
        this.state = {
            'lat': 49.28,
            'lon': -123.145
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleClick(event) {
        drawMarker(this.state.lat, this.state.lon);
        event.preventDefault();
    }
    handleChange(event) {
        console.log(event.target.value);
        this.setState({
            [event.target.name]: event.target.value
        });
        event.preventDefault();
    }
    render() {
        var btnClass = classNames({
            'btn': true,
            'btn-primary': true
        });
        return (
            <form id="test">
                <input type="number" step='0.001' id="lat" name="lat" onChange={this.handleChange} defaultValue={this.state.lat} />
                <input type="number" step='0.001' id="lon" name="lon" onChange={this.handleChange} defaultValue={this.state.lon} />
                <br /><br />
                <button className={btnClass} onClick={this.handleClick}>Add Pin!</button>
            </form>
        );
    }
};

// ReactDOM.render(
//     <TestMapWidget />,
//     document.getElementById('testMapWidget')
// );