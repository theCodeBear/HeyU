'use strict';

angular.module('close')

.controller('ChatCtrl', ChatCtrl);

ChatCtrl.$inject = ['$timeout', 'User', 'Settings', 'Socket', '$interval'];

function ChatCtrl($timeout, User, Settings, Socket, $interval) {

  let vmChat = this;

  let intervalTimer;
  vmChat.tick = 600;
  vmChat.username = User.get();
  vmChat.distanceSelected = null;
  vmChat.chatFound = null;
  vmChat.messageHistory = [];
  vmChat.selectDistance = selectDistance;
  vmChat.sendMessage = sendMessage;
  vmChat.ditchChat = ditchChat;
  vmChat.isThisUser = (name) => (vmChat.username === name) ? true : false;


  Socket.on('user connected', (msg) => {
    console.log(msg);
  });

  // $interval(() => {
  //   Socket.emit('blast', 'yooo');
  // }, 2000)

  Socket.on('receive message', (msg) => {
    vmChat.messageHistory.push(msg);
  });

  function lookingForSomeone() {
    $timeout(() => {
      vmChat.chatFound = true;
      intervalTimer = $interval(() => vmChat.tick--, 1000);
    }, 3000);
  }

  function selectDistance(distance) {
    vmChat.distanceSelected = distance;
    Settings.setRange(distance);
    lookingForSomeone();
  }

  function sendMessage(msg) {
    let message = {user: vmChat.username, message: msg};
    vmChat.messageHistory.push(message);
    vmChat.message = '';
    Socket.emit('message sent', message);
  }

  function ditchChat() {
    $interval.cancel(intervalTimer);
    vmChat.tick = 600;
    vmChat.chatFound = false;
    lookingForSomeone();
    vmChat.messageHistory = [];
  }


}