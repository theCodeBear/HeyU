'use strict';

angular.module('heyU')

.factory('User', User);

User.$inject = ['$window', '$state', 'jwtHelper'];


function User($window, $state, jwtHelper) {

  let _user;
  let _token;

  let service = {
    initUserAndToken,
    getUserProfile,
    getUser,
    getToken,
    getUserFromLocalStorage,
    saveUserToLocalStorage,
    getTokenFromLocalStorage,
    saveTokenToLocalStorage,
    getExpirationAsDateObject,
    logout
  };

  return service;


// FACTORY PUBLIC METHODS
  function initUserAndToken() {
    _user = getUserFromLocalStorage();
    _token = getTokenFromLocalStorage();
  }

  function getUserProfile() {
    return {
      name: _user.name,
      age: _user.age,
      gender: _user.gender,
      bio: _user.bio,
      photo: _user.photo,
      profession: _user.profession,
      interests: _user.interests
    };
  }

  function getUser() {
    return _user;
  }

  function getToken() {
    return _token;
  }

  function getUserFromLocalStorage() {
    return JSON.parse($window.localStorage.getItem('heyU_user'));
  }

  function saveUserToLocalStorage(user) {
    $window.localStorage.setItem('heyU_user', JSON.stringify(user));
    _user = user;
  }

  function getTokenFromLocalStorage() {
    return $window.localStorage.getItem('heyU_token');
  }

  function saveTokenToLocalStorage(token) {
    $window.localStorage.setItem('heyU_token', token);
    _token = token;
  }

  // returns null if no token is currently saved
  function getExpirationAsDateObject() {
    if (!_token) return null;
    let exp = jwtHelper.decodeToken(_token).exp;
    return new Date(exp);
  }

  function logout() {
    $window.localStorage.removeItem('heyU_user');
    $window.localStorage.removeItem('heyU_token');
    _token = null;
    _user = null;
    $state.go('login');
  }

}