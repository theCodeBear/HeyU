'use strict';

angular.module('close')

.controller('ChatCtrl', ChatCtrl);

ChatCtrl.$inject = ['$timeout', 'User', 'Settings', 'Socket', '$interval', '$cordovaGeolocation'];

function ChatCtrl($timeout, User, Settings, Socket, $interval, $cordovaGeolocation) {

  let vmChat = this;

  let mySocketId;
  let theirSocketId;
  let intervalTimer;
  let coords = {};
  let posOptions = {timeout: 10000, enableHighAccuracy: true};
  const CHAT_TIME_AMOUNT = 600;
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


  Socket.on('user connected', (socketId) => {
    mySocketId = socketId;
    console.log('my socket', mySocketId);
  });

  Socket.on('receive message', (msg) => {
    vmChat.messageHistory.push(msg);
  });

  Socket.on('somone is available', () => {
    lookingForSomeone();
  });

  function lookingForSomeone() {
    console.log('sending step 1');
    // Sending step 1 in finding person, user array in callback
    Socket.emit('finding people', mySocketId, (liveUsers, usersCoords) => {
      console.log(liveUsers);
      console.log(liveUsers[Math.floor(Math.random() * liveUsers.length)]);
      console.log('users coords', usersCoords);
      if (liveUsers.length === 0) return;
      let otherUserSocketId = liveUsers[Math.floor(Math.random() * liveUsers.length)];
      if (otherUserSocketId) {
        theirSocketId = 'waiting';
        // Sending step 2 in finding person
        console.log('sending step 2');
        Socket.emit('attempt connection',
          {sendingId: mySocketId, sendingName: vmChat.username, receivingId: otherUserSocketId}
        );
      } else {
        $timeout(() => {
      if (!theirSocketId) lookingForSomeone();
    }, Math.random() * 700 + 300);
      }
    });
  }

  // receiving step 3 in finding person
  Socket.on('can you connect', (ids) => {
    console.log('received step 3');
    console.log('theirSocketId', theirSocketId);
    if (!theirSocketId) {
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
        if (!vmChat.chatFound && theirSocketId) {
          console.log('******** IN 2 SECOND TIMEOUT');
          theirSocketId = null;
        }
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

  Socket.on('chat is over', () => {
    ditchChat(false);
  });

  Socket.on('user got disconnected', () => {
    alert('Other user was disconnected :(');
    ditchChat(false);
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
    Settings.setRange(distance);
    // addIdToAvailableList(coords);
    getCoordinates();
    // lookingForSomeone();
  }

  function getCoordinates() {
    $cordovaGeolocation.getCurrentPosition(posOptions).then((position) => {
      console.log(position);
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


}