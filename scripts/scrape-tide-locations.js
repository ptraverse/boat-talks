/**
 * Going to BORROW tide locations from http://tides.mobilegeographics.com/index.html
 * With an eye to using the graph on each location page,
 * e.g. http://tides.mobilegeographics.com/locations/5859.html
 * Mongodb collection 'bt.tidelocations':
 *  Fields: name, location , lat, lon
 * From that, the map can show an icon, and when user clicks icon, server can fetch (and cache) the graph...
 *
 * This scrip must be invoked using phantomjs environment !!
 * i.e. `phantomjs scrape-tide-locations.js` NOT `node scrape-tide-locations.js`
 *
 **/

var _ = require('underscore');
var webpage = require('webpage');

var page = webpage.create();
var loadInProgress = false;
var testindex = 0;

page.onConsoleMessage = function(msg) {
  console.log('console> ' + msg);
};
page.onAlert = function(msg) {
  console.log('alert!> ' + msg);
};
page.onLoadStarted = function() {
  loadInProgress = true;
  // console.log("load started");
};
page.onLoadFinished = function(status) {
  loadInProgress = false;
  if (status !== 'success') {
    console.log('Unable to access network');
    phantom.exit();
  } else {
    console.log("load finished");
  }
};

//Each step is stepped into by the interval function at the end
var steps = [

  //Go to dat url
  function() {
    page.open('http://tides.mobilegeographics.com/index.html');
  },

  //Iterate through table
  // TODO Finish this.
  function() {

    var a = document.evaluate(
      '//tr[position()>1]/td[position()=1]',
      document,
      null,
      XPathResult.STRING_TYPE,
      null);

    console.log(JSON.stringify(a));

    return a.stringValue.toLowerCase();
  }

];

interval = setInterval(function() {
  if (!loadInProgress && typeof steps[testindex] == "function") {
    console.log("step " + (testindex + 1));
    var result = steps[testindex]();
    testindex++;
    if (typeof result !== 'undefined') {
      console.log(result);
    }
  }
  if (typeof steps[testindex] != "function") {
    console.log("test complete!");
    console.log(steps[testindex]);
    phantom.exit();
  }
}, 50);
