/* eslint-disable no-console */

// util

function mainStation(user) {
  switch (user.length) {
    case 3:
      return 'court';
    case 6:
      return 'floor';
    default:
      return 'porch';
  }
}

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
  station = '~' + window.urb.user + '/' + mainStation(window.urb.user);

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

(function bindGrams() {
  var path = '/f/' + mainStation(window.urb.user) + '/0';                             // f = grams. fetch all messages of station.

  return window.urb.bind(
    path,
    {
      appl: 'talk',
      mark: 'json',
      ship: window.urb.user
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
};
