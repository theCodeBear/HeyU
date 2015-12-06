'use strict';

angular.module('heyU')

.filter('timer', timer);

timer.$inject = [];

function timer() {
  return (input) => {
    let mins = Math.floor(input/60);
    let secs = input % 60;
    if (secs < 10) secs = '0' + secs;
    return `${mins}:${secs}`;
  };
}