/* eslint-disable no-console */

console.log("We're serving some JavaScript through Urbit to the browser.");

function someJavaScript() {                             // test
  console.log("Now we're calling some other JavaScript.");
}

window.module = window.module || {};                    // eslint-disable-line no-global-assign
module.exports = {
  someJavaScript: someJavaScript
};
