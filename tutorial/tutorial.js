/* eslint-disable no-console */

function sayHi() {
  var data = 'hi. :)';

  document.getElementById('hiButton').disabled = true;

  return window.urb.send(
    data,                                               // data
    {                                                   // params
      appl: 'hood',
      mark: 'helm-hi',
      ship: window.urb.user
    },
    function sentMessage(error, response) {             // callback
      if (error || !response.data || response.fail) {
        console.warn('`urb.send` to ~' + window.urb.user + ' the data payload:');
        console.warn(data);
        console.warn('failed. Error:');
        console.warn(error);
        console.warn(response);
        return;
      }
      console.log('`urb.send` to ~' + window.urb.user + ' the data payload:');
      console.log(data);
      console.log('succeeded! Response:');
      console.log(response.data);
      document.getElementById('response').innerHTML = '<code>' + JSON.stringify(response.data) + '</code>';
      document.getElementById('shipHi').innerHTML = '<code>~' + window.urb.user + '</code> says hi back!';
      document.getElementById('hiButton').disabled = false;
    });
}

window.module = window.module || {};                    // eslint-disable-line no-global-assign
module.exports = {
  sayHi: sayHi
};
