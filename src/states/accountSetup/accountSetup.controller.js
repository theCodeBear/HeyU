'use strict';

angular.module('heyU')

.controller('AccountSetupCtrl', AccountSetupCtrl);

AccountSetupCtrl.$inject = ['$state', 'User'];

function AccountSetupCtrl($state, User) {

  let vmAccount = this;


  vmAccount.saveProfile = saveProfile;




  function saveProfile(user) {
    User.set(user);
    $state.go('app.chat');
  }

}