'use strict';

angular.module('close')

.controller('ChatCtrl', ChatCtrl);

ChatCtrl.$inject = ['$timeout', 'User', 'Socket', '$interval', '$cordovaGeolocation'];

function ChatCtrl($timeout, User, Socket, $interval, $cordovaGeolocation) {

  let vmChat = this;

  const CHAT_TIME_AMOUNT = 600; // seconds
  let mySocketId;
  let theirSocketId;
  let intervalTimer;
  let coords = {};
  let posOptions = {timeout: 10000, enableHighAccuracy: true};
  vmChat.theirName = null;
  vmChat.tick = CHAT_TIME_AMOUNT;
  vmChat.username = User.get();
  vmChat.distanceSelected = null;
  vmChat.chatFound = null;
  vmChat.messageHistory = [];
  vmChat.selectDistance = selectDistance;
  vmChat.sendMessage = sendMessage;
  vmChat.ditchChat = ditchChat;
  vmChat.isThisUser = (name) => (vmChat.username === name) ? true : false;


  Socket.on('user connected', (socketId) => mySocketId = socketId);
  Socket.on('receive message', (msg) => vmChat.messageHistory.push(msg));
  Socket.on('somone is available', () => lookingForSomeone());
  Socket.on('chat is over', () => ditchChat(false));
  Socket.on('user got disconnected', () => {
    alert('Other user was disconnected :(');
    ditchChat(false);
  });

  function lookingForSomeone() {
    console.log('sending step 1');
    // Sending step 1 in finding person, user array in callback
    Socket.emit('finding people', mySocketId, (liveUsers, usersCoords) => {
      console.log('mysocketID', mySocketId);
      if (liveUsers.length === 0) return;
      // filter people array by distance, returns distances array to match people array.
      let userDistances = filterUsersForDistance(liveUsers, usersCoords, vmChat.distanceSelected);
      let pickedIndex = Math.floor(Math.random() * liveUsers.length);
      let otherUserSocketId = liveUsers[pickedIndex];
      if (otherUserSocketId) {
        theirSocketId = 'waiting';
        // Sending step 2 in finding person
        console.log('sending step 2');
        // sending distance so other user can check distance against their own setting
        Socket.emit('attempt connection', {
            sendingId: mySocketId,
            sendingName: vmChat.username,
            receivingId: otherUserSocketId,
            distance: userDistances[pickedIndex]
        });
      } else {
        $timeout(() => {
          if (!theirSocketId) lookingForSomeone();
        }, Math.random()*700+300);
      }
    });
  }

  // receiving step 3 in finding person
  Socket.on('can you connect', (ids) => {
    console.log('received step 3');
    if (!theirSocketId && ids.distance <= vmChat.distanceSelected) {
      theirSocketId = ids.sendingId;
      vmChat.theirName = ids.sendingName;
      ids.receivingName = vmChat.username;
      // sending step 4 success in finding person
      console.log('sending success step 4');
      Socket.emit('lets chat', ids);
      removeIdFromAvailableList();
      startChatCountdown();
    } else {
      // sending step 4 failure in finding person
      console.log('sending failure step 4');
      Socket.emit('busy', ids);
      // This timeout fixes a bug in which the client would stop looking for
      // a connection sometimes, not sure the cause of the bug, but this fixes it.
      $timeout(() => {
        if (!vmChat.chatFound && theirSocketId) theirSocketId = null;
      }, 2000);
    }
  });

  // receiving step 5 failure in finding person. Wait, then restart process.
  Socket.on('cannot connect', () => {
    console.log('receiving failure step 5, its over');
    theirSocketId = null;
    $timeout(() => {
      if (!theirSocketId) lookingForSomeone();
    }, Math.random() * 700 + 300);
  });

  // receiving step 5 success in finding person
  Socket.on('ready to connect', (ids) => {
    console.log('receiving success step 5');
    theirSocketId = ids.receivingId;
    vmChat.theirName = ids.receivingName;
    removeIdFromAvailableList();
    startChatCountdown();
  });


  // runs the clock countdown
  function startChatCountdown() {
    // removeIdFromAvailableList();  -- if only end up using this when calling this function, just put this here
    vmChat.chatFound = true;
    let start = new Date().getTime();
    let elapsedSecs = 0;
    intervalTimer = $interval(() => {
      if (vmChat.tick === 0) return ditchChat(true);
      let elapsedMillis = new Date().getTime() - start;
      elapsedSecs = Math.floor(elapsedMillis/1000);
      vmChat.tick = CHAT_TIME_AMOUNT - elapsedSecs;
    }, 500);
  }

  function addIdToAvailableList(coordinates) {
    Socket.emit('available for chat', coordinates);
  }

  function removeIdFromAvailableList() {
    Socket.emit('unavailable for chat');
  }

  function selectDistance(distance) {
    vmChat.distanceSelected = distance;
    getCoordinates();
  }

  function getCoordinates() {
    $cordovaGeolocation.getCurrentPosition(posOptions).then((position) => {
      coords.lat = position.coords.latitude;
      coords.lon = position.coords.longitude;
      addIdToAvailableList(coords);
      lookingForSomeone();
    });
  }

  function sendMessage(msg) {
    let message = {user: vmChat.username, message: msg, room: theirSocketId};
    vmChat.messageHistory.push(message);
    vmChat.message = '';
    Socket.emit('message sent', message);
  }

  function ditchChat(endedByYou) {
    if (endedByYou) Socket.emit('chat ended', theirSocketId);
    $interval.cancel(intervalTimer);
    vmChat.tick = CHAT_TIME_AMOUNT;
    vmChat.chatFound = false;
    addIdToAvailableList(coords);
    lookingForSomeone();
    vmChat.messageHistory = [];
  }

  function filterUsersForDistance(users, userCoords, distanceMax) {
    let distances = [];
    let miles;
    // later might want to optimize this by using a normal for-loop and only grab
    // the first, say, 100 users who are within the distance range. This optimization
    // of course would only be needed if this app were super popular and had thousands
    // of people using it within the short distance ranges it allows, so very unlikely.
    angular.copy(users.filter((el, i) => {
      miles = getDistanceFromCoords(coords.lat, coords.lon, userCoords[i].lat, userCoords[i].lon);
      if (miles <= +distanceMax) {
        distances.push(miles);
        return true;
      } else
        return false;
    }), users);
    return distances;
  }

  // given two pairs of geo-coords, returns distance in miles
  function getDistanceFromCoords(lat1, lon1, lat2, lon2) {
    const earthRadius = 3959;   // in miles
    let dLat = degToRadians(lat2 - lat1);
    let dLon = degToRadians(lon2 - lon1);
    let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(degToRadians(lat1)) * Math.cos(degToRadians(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return earthRadius * c;
  }

  function degToRadians(deg) {
    return deg * (Math.PI / 180);
  }

}