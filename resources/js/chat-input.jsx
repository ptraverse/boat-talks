'use strict';

var classNames = require('classnames');
var React = require('react');
var ReactDOM = require('react-dom');

var socket = io.connect();

class ChatInputWidget extends React.Component {
    constructor() {
        super()
        this.state = {
            'name': '',
            'message': '',
            'lat': 49.28,
            'lon': -123.145
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleClick(event) {
        socket.emit('client event', 
            { 
                'name': this.state.name,
                'message': this.state.message,
                'lat': this.state.lat,
                'lon': this.state.lon
            });
        this.refs.message.value = '';
        event.preventDefault();
    }
    handleChange(event) {
        // console.log(event.target.value);
        this.setState({
            [event.target.name]: event.target.value
        });
        event.preventDefault();
    }
    render() {
        var btnClass = classNames({
            'btn': true,
            'btn-primary': true,
            'col-md-12': true,
            'col-sm-12': true
        });
        var col2 = classNames({
            'col-md-2': true,
            'col-sm-2': true
        });
        var col6 = classNames({
            'col-md-6': true,
            'col-sm-6': true
        });
        var col1 = classNames({
            'col-md-1': true,
            'col-sm-1': true
        });
        return (
            <form id="test" action="">
                <input className={col2} type="text" ref="name" id="name" name="name" onChange={this.handleChange} defaultValue={this.state.name} />
                <input className={col6} type="text" ref="message" id="message" name="message" onChange={this.handleChange} defaultValue={this.state.message} />
                <input className={col1} type="number" step='0.001' ref="lat" id="lat" name="lat" onChange={this.handleChange} defaultValue={this.state.lat} />
                <input className={col1} type="number" step='0.001' ref="lon" id="lon" name="lon" onChange={this.handleChange} defaultValue={this.state.lon} />
                <div className={col2}>
                    <button className={btnClass} onClick={this.handleClick}>Send</button>
                </div>
            </form>
        );
    }
};

ReactDOM.render(
    <ChatInputWidget />,
    document.getElementById('chatInputWidget')
);