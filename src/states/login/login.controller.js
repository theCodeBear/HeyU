'use strict';

angular.module('heyU')

.controller('LoginCtrl', LoginCtrl);

LoginCtrl.$inject = ['$auth', '$window'];

function LoginCtrl($auth, $window) {

  let vmLogin = this;


  vmLogin.authenticate = authenticate;




  function authenticate(provider) {
    $auth.authenticate(provider).then((response) => {
      console.log('SUCCESS', response);
      // $window.localStorage.setItem('heyu_token', response.token);
      // $window.localStorage.setItem('heyu_user', JSON.stringify(response.user));
    }).catch((response) => {
      console.log('ERROR', JSON.stringify(response));
    });
  }

}