'use strict';

angular.module('heyU')

.factory('User', User);

User.$inject = [];


function User() {

  let _user;

  let service = {
    get,
    set
  };

  return service;



  function get() {
    return _user;
  }

  function set(name) {
    _user = name;
  }

}