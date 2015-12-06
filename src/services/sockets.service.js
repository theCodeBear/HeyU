'use strict';

angular.module('close')

.factory('Socket', Socket);


Socket.$inject = ['socketFactory'];

function Socket(socketFactory) {
  return socketFactory({
    ioSocket: io.connect('http://192.168.1.102:3000')//130:3000')
  });
}