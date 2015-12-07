'use strict';

angular.module('heyU', ['ionic', 'btford.socket-io', 'ngCordova'])

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


config.$inject = ['$stateProvider', '$urlRouterProvider'];

function config($stateProvider, $urlRouterProvider) {


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
