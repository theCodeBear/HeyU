'use strict';

angular.module('heyU')

.controller('AccountSetupCtrl', AccountSetupCtrl);

AccountSetupCtrl.$inject = ['$state', 'User'];

function AccountSetupCtrl($state, User) {

  let vmAccount = this;


  vmAccount.saveProfile = saveProfile;




  function saveProfile(inputs) {
    inputs.interests = [];
    for (var key in inputs.hobbies) {
      if (inputs.hobbies[key].trim()) inputs.interests.push(inputs.hobbies[key]);
    }
    delete inputs.hobbies;
    User.updateUserInfoInDB(inputs).then((response) => {
      User.updateUserLocally(response.data);
      $state.go('app.chat');
    }).catch((response) => {
      console.log('ERROR calling PUT /users', JSON.stringify(response));
    });
  }

}