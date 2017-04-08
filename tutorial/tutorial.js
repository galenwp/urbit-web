/* eslint-disable no-console */

// util

function uuid32() {                                     // generate unique serial number
  var i;
  var digitGroup;
  var serial = '0v' + Math.ceil(Math.random() * 8) + '.';
  for (i = 0; i <= 5; ++i) {                            // eslint-disable-line no-plusplus
    digitGroup = Math.ceil(Math.random() * 10000000).toString(32);
    digitGroup = ('00000' + digitGroup).substr(-5, 5);
    serial += digitGroup + '.';
  }
  return serial.slice(0, -1);
}

// helpers

function loadCabal(cabal) {
  var ship;
  var station;

  window.stationConfig = cabal.loc;

  if (!(window.location.search)) {
    ship = window.urb.user;
  } else {
    ship = window.location.search.substring(7);
  }
  station = '~' + ship + '/public';                     // load all grams (messages) at station path.

  if (ship === window.urb.user && !(window.location.search)) {
    return document.getElementById('postBox').classList.remove('hidden');
  }

  if (cabal.loc.sources.includes(station)) {
    return document.getElementById('unsubscribeButton').classList.remove('hidden');
  }
  return document.getElementById('subscribeButton').classList.remove('hidden');
}

function loadGrams(grams) {
  var oldPosts = document.getElementById('posts').innerHTML;
  var newPosts = '';
  grams.tele.slice().reverse().forEach(function showGram(gram) { // grams are array; display new 1st
    var textDiv = document.createElement('div');
    textDiv.innerText = gram.thought.statement.speech.lin.txt;
    newPosts += '<div class="post">';
    newPosts += '<h2 class="ship-display">~' + gram.ship + '</h2>';
    newPosts += '<h3>' + new Date(gram.thought.statement.date) + '</h3>';
    newPosts += textDiv.innerHTML;
    newPosts += '</div>';
  });
  document.getElementById('posts').innerHTML = newPosts + oldPosts; // newest first.
  document.getElementById('postButton').disabled = false;
}

// main

function sendPost() {
  var audience;
  var post;
  var speech;
  var station;
  var text;
  var thought;

  document.getElementById('postButton').disabled = true;

  text = document.getElementById('postBox').value;
  station = '~' + window.urb.user + '/public';

  audience = {};
  audience[station] = {
    envelope: {
      visible: true,
      sender: null
    },
    delivery: 'pending'
  };

  speech = {
    lin: {
      txt: text,
      say: true
    }
  };

  thought = {
    serial: uuid32(),
    audience: audience,
    statement: {
      bouquet: [],
      speech: speech,
      date: Date.now()
    }
  };

  post = {};
  post.publish = [thought];

  return window.urb.send(post, {
    appl: 'talk',
    mark: 'talk-command',
    ship: window.urb.user
  },
  function sentMessage(error, response) {
    if (error || !response.data || response.fail) {
      console.warn('`urb.send` to ~' + window.urb.user + ' the data payload:');
      console.warn(post);
      console.warn('failed. Error:');
      console.warn(error);
      console.warn(response);
      return;
    }
    console.log('`urb.send` to ~' + window.urb.user + ' the data payload:');
    console.log(post);
    console.log('succeeded! Response:');
    console.log(response.data);
  });
}

function subscribe() {
  var design;
  var ship = window.location.search.substring(7);
  var station = '~' + ship + '/public';

  document.getElementById('subscribeButton').disabled = true;

  if (window.stationConfig.sources.includes(station)) {
    return;
  }

  window.stationConfig.sources.push(station);           // add station to sources.

  design = {
    design: {
      party: 'feed',
      config: window.stationConfig
    }
  };

  window.urb.send(design, {
    appl: 'talk',
    mark: 'talk-command',
    ship: window.urb.user
  },
  function subscribed(error, response) {
    if (error || !response.data || response.fail) {
      console.warn('`urb.send` to ~' + window.urb.user + ' the data payload:');
      console.warn(design);
      console.warn('failed. Error:');
      console.warn(error);
      console.warn(response);
      return;
    }
    console.log('`urb.send` to ~' + window.urb.user + ' the data payload:');
    console.log(design);
    console.log('succeeded! Response:');
    console.log(response.data);
    location.reload();
  });
}

function unsubscribe() {
  var design;
  var ship = window.location.search.substring(7);
  var station = '~' + ship + '/public';

  document.getElementById('unsubscribeButton').disabled = true;

  if (!(window.stationConfig.sources.includes(station))) {
    return;
  }

  if (window.stationConfig.sources.indexOf(station) > -1) { // remove station from sources
    window.stationConfig.sources.splice(
      window.stationConfig.sources.indexOf(station),
      1
    );
  }

  design = {
    design: {
      party: 'feed',
      config: window.stationConfig
    }
  };

  window.urb.send(design, {
    appl: 'talk',
    mark: 'talk-command',
    ship: window.urb.user
  },
  function unsubscribed(error, response) {
    if (error || !response.data || response.fail) {
      console.warn('`urb.send` to ~' + window.urb.user + ' the data payload:');
      console.warn(design);
      console.warn('failed. Error:');
      console.warn(error);
      console.warn(response);
      return;
    }
    console.log('`urb.send` to ~' + window.urb.user + ' the data payload:');
    console.log(design);
    console.log('succeeded! Response:');
    console.log(response.data);
    location.reload();
  });
}

function fetch() {
  var ship = document.getElementById('fetchBox').value;
  if (!(ship.charAt(0) === '~')) {
                                                        // TODO: less intrusive error message
                                                        // eslint-disable-next-line no-alert
    alert('Not a valid station. A valid station is ~ship/station.');
    return;
  }

  ship = ship.substr(1);


  window.location.href =
    window.location.protocol + '//' +
    window.location.host +
    window.location.pathname +
    '?ship=~' + ship;
}

// onLoad

(function bindCabal() {                                 // load user feed station metadata
  var path = '/x/feed';                                 // x = cabal. full bind-station path.
  return window.urb.bind(
    path,
    {
      appl: 'talk',
      mark: 'json',
      ship: window.urb.user
    },
    function gotCabal(error, response) {
      if (error || !response.data || response.fail) {
        console.warn('urb.bind at path `' + path + '` failed. Error: ');
        console.warn(error);
        console.warn(response);
        return;
      }
      console.log('urb.bind at path: `' + path + '` succeeded! Response data: ');
      console.log(response.data);
      loadCabal(response.data.cabal);
    });
}());

(function bindGrams() {
  var path;
  var ship;
  var station;

  if (!(window.location.search)) {
    ship = window.urb.user;
    station = 'feed';
  } else {
    ship = window.location.search.substring(7);
    station = 'public';
  }
  path = '/f/' + station + '/0';                        // f = grams. fetch all messages of station.

  return window.urb.bind(
    path,
    {
      appl: 'talk',
      mark: 'json',
      ship: ship
    },
    function gotGrams(error, response) {
      if (error || !response.data || response.fail) {
        console.warn('urb.bind at path `' + path + '` failed. Error: ');
        console.warn(error);
        console.warn(response);
        return;
      }
      console.log('urb.bind at path: `' + path + '` succeeded! Response data: ');
      console.log(response.data);
      loadGrams(response.data.grams);
    });
}());

window.module = window.module || {};                    // eslint-disable-line no-global-assign
module.exports = {
  sendPost: sendPost,
  subscribe: subscribe,
  unsubscribe: unsubscribe,
  fetch: fetch
};
