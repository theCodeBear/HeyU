'use strict';

angular.module('heyU')

.factory('Socket', Socket);


Socket.$inject = ['socketFactory'];

function Socket(socketFactory) {
  return socketFactory({
    ioSocket: io.connect('http://192.168.1.114:3000')
  });
}