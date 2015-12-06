'use strict';

angular.module('heyU')

.controller('LoginCtrl', LoginCtrl);

LoginCtrl.$inject = ['$auth'];

function LoginCtrl($auth) {

  let vmLogin = this;


  vmLogin.authenticate = authenticate;




  function authenticate(provider) {
    $auth.authenticate(provider).then((response) => {
      // handle successfull authentication
      console.log('SUCCESS', response);
    }).catch((response) => {
      // handle error
      console.log('ERROR', response);
    });
  }

}