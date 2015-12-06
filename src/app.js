'use strict';

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('close', ['ionic', 'btford.socket-io', 'ngCordova', 'satellizer'])

.run(run)
.config(config);



run.$inject = ['$ionicPlatform'];

function run($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
}


config.$inject = ['$stateProvider', '$urlRouterProvider', '$authProvider'];

function config($stateProvider, $urlRouterProvider, $authProvider) {

  $authProvider.facebook({
    clientId: '197260627276113'//,
    // redirectUri: 'http://localhost:3000/auth/facebook'
  });

  $stateProvider

  .state('login', {
    url: '/',
    templateUrl: 'states/login/login.html',
    controller: 'LoginCtrl as vmLogin'
  })

  .state('accountSetup', {
    url: '/accountSetup',
    templateUrl: 'states/accountSetup/accountSetup.html',
    controller: 'AccountSetupCtrl as vmAccount'
  })

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'states/menu/menu.html',
    controller: 'MenuCtrl as vmMenu'
  })

  .state('app.chat', {
    url: '/chat',
    views: {
      'menuContent': {
        templateUrl: 'states/chat/chat.html',
        controller: 'ChatCtrl as vmChat'
      }
    }
  })

  .state('app.profile', {
    url: '/profile',
    views: {
      'menuContent': {
        templateUrl: 'states/profile/profile.html',
        controller: 'ProfileCtrl as vmProfile'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');
}
