var React = require('react');
var ReactDOM = require('react-dom');
var SwipeableViews = require('react-swipeable-views');

const SwipeGrid = () => (
  <SwipeableViews>
    <div id="map_div" style={Object.assign({}, styles.slide, styles.slide1)}>
    </div>
    <div id="chat_div" style={Object.assign({}, styles.slide, styles.slide2)}>
      Chat Div
    </div>
    <div id="profile_div" style={Object.assign({}, styles.slide, styles.slide3)}>
      Profile
    </div>
  </SwipeableViews>
);

const styles = {
  slide: {
    padding: 15,
    minHeight: 100,
    color: '#fff',
  }
};

ReactDOM.render(
    <SwipeGrid />,
    document.getElementById('swipe_grid')
);