'use strict';

angular.module('heyU', ['ionic', 'btford.socket-io', 'ngCordova', 'angular-jwt'])

.run(run)
.config(config);



run.$inject = ['$ionicPlatform', '$state', 'User'];

function run($ionicPlatform, $state, User) {
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

    User.initUserAndToken();
    // if user logged in
    if (User.getUser() && User.getToken() && (User.getExpirationAsDateObject() > Date.now())) {
      // user has completed account setup or not
      User.getUser().age ? $state.go('app.chat') : $state.go('accountSetup');
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
    templateUrl: 'states/menu/menu.html'
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
  })

  .state('app.settings', {
    url: '/settings',
    views: {
      'menuContent': {
        templateUrl: 'states/settings/settings.html',
        controller: 'SettingsCtrl as vmSettings'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');
}
