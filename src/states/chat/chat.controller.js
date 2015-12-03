'use strict';

angular.module('close')

.controller('ChatCtrl', ChatCtrl);

ChatCtrl.$inject = ['$timeout', 'User', 'Settings'];

function ChatCtrl($timeout, User, Settings) {

  let vmChat = this;
  vmChat.username = User.get();
  vmChat.distanceSelected = null;
  vmChat.chatFound = null;
  vmChat.selectDistance = selectDistance;




  function selectDistance(distance) {
    vmChat.distanceSelected = distance;
    Settings.setRange(distance);
    $timeout(() => {
      vmChat.chatFound = true;
    }, 3000);
  }


}