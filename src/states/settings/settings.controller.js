'use strict';

angular.module('heyU')

.controller('SettingsCtrl', SettingsCtrl);

SettingsCtrl.$inject = ['User'];

function SettingsCtrl(User) {

  let vmSettings = this;


  vmSettings.logout = User.logout;

}