'use strict';

angular.module('heyU')

.controller('LoginCtrl', LoginCtrl);

LoginCtrl.$inject = ['$window', '$http', '$state', '$cordovaOauth', 'User'];

function LoginCtrl($window, $http, $state, $cordovaOauth, User) {

  let vmLogin = this;


  vmLogin.authenticate = authenticate;



  function authenticate() {
    // LOGIN FLOW:
    // on angular run() function check if access token in local storage and it
    // hasn't expired.
    // if it is then skip the login page and go straight to 'app.chat' state.
    // if it is is not then this page will load. have user hit facebook login
    // button and when it calls the back end, on the server see
    // if user is already in database, if it is send back a third argument of true
    // telling client user already exists (user, token, true) so client know to skip
    // the accountSetup page and go straight to the chat page. if server sends back
    // (user, token, false) that means user was just created in DB so app needs to
    // go to accountSetup page.
    $cordovaOauth.facebook('197260627276113', ['email']).then((fbToken) => {
      $http.get('https://graph.facebook.com/v2.5/me', {
        params: {
          access_token: fbToken.access_token,
          fields: 'first_name,gender',
          format: 'json'
        }
      }).then((result) => {
        $http.post('http://192.168.1.114:3000/user/authenticate', result.data)
        .then(({data: { user, token, alreadyInDB }}) => {
          User.saveUserToLocalStorage(user);
          User.saveTokenToLocalStorage(token);
          (alreadyInDB && User.getUser().age) ? $state.go('app.chat') : $state.go('accountSetup');
        }).catch(error => console.log('error creating user', JSON.stringify(error)));
      }).catch(error => console.log('second part error', JSON.stringify(error)));
    }).catch(error => console.log('error', JSON.stringify(error)));
  }

}