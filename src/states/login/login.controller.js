'use strict';

angular.module('heyU')

.controller('LoginCtrl', LoginCtrl);

LoginCtrl.$inject = ['$window', '$http', '$cordovaOauth'];

function LoginCtrl($window, $http, $cordovaOauth) {

  let vmLogin = this;


  vmLogin.authenticate = authenticate;




  function authenticate(provider) {
    // LOGIN FLOW:
    // on angular run() function check if access token in local storage and it
    // hasn't expired.
    // if it is then skip the login page and go straight to 'app.chat' state.
    // if it is is not then this page will load.
    // have user login in and when it calls the back end, on the server see
    // if user is already in database, if it is send back a third argument of true
    // telling client user already exists (user, token, true) so client know to skip
    // the accountSetup page and go straight to the chat page. if server sends back
    // (user, token, false) that means user was just created in DB so app needs to
    // go to accountSetup page.
    $cordovaOauth.facebook('197260627276113', ['email']).then((fbToken) => {
      // console.log('SUCCESS', JSON.stringify(token));
      $http.get('https://graph.facebook.com/v2.5/me', {
        params: {
          access_token: fbToken.access_token,
          fields: 'first_name,gender',
          format: 'json'
        }
      }).then((result) => {
        // console.log('result:', JSON.stringify(result));
        $http.post('http://localhost:3000/user/create', result.data).then((userAndToken) => {
          console.log('user and token', JSON.stringify(userAndToken));
          // here need to save user and token to localStorage and route to next state
          // $window.localStorage.setItem('heyU_token', userAndToken.token);
          // $window.localStorage.setItem('heyU_user', userAndToken.user);
          // $state.go('')
        }).catch(error => console.log('error creating user', JSON.stringify(error)));
      }).catch(error => console.log('second part error', JSON.stringify(error)));
    }).catch(error => console.log('error', JSON.stringify(error)));
  }

}