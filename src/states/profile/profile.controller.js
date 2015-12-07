'use strict';

angular.module('heyU')

.controller('ProfileCtrl', ProfileCtrl);

ProfileCtrl.$inject = ['User'];

function ProfileCtrl(User) {

  let vmProfile = this;


  vmProfile.user = User.getUserProfile();

}