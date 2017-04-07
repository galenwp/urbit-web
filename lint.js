if (!(window.location.search)) {
  document.getElementById('shipDisplay').innerHTML = '~' + window.urb.user;
} else {
  document.getElementById('shipDisplay').innerHTML = '~' + window.location.search.substring(7); // XX
}

document.getElementById('fetchBox').addEventListener('keyup', function(e) {
    if (!e) { var e = window.event; }
    e.preventDefault();                                 // XX stackoverflow boilerplate
    if (e.keyCode == 13) { fetch(); }                   // send on Enter keyup
}, false);
document.getElementById('postBox').addEventListener('keyup', function(e) {
    if (!e) { var e = window.event; }
    e.preventDefault();                                 // XX stackoverflow boilerplate
    if (e.keyCode == 13) { sendPost(); }                // send on Enter keyup
}, false);
document.getElementById('loading').classList.remove('hidden');
