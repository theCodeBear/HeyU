'use strict';

angular.module('close')

.factory('Settings', Settings);

Settings.$inject = [];



function Settings() {

  let _settings = {
    range: 0
  };


  let service = {
    getRange,
    setRange
  };

  return service;


  function getRange() {
    return _settings.range;
  }

  function setRange(range) {
    _settings.range = +range;
  }

}