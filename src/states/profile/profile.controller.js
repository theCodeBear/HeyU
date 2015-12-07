'use strict';

angular.module('heyU')

.controller('ProfileCtrl', ProfileCtrl);

ProfileCtrl.$inject = ['User'];

function ProfileCtrl(User) {

  let vmProfile = this;


  // vmProfile.user = User.getUserProfile();

  vmProfile.user = {
    name: 'Todd',
    gender: 'male',
    photo: 'https://graph.facebook.com/10100330254963461/picture?type=large',
    bio: 'I am a really cool dude who loves the outdoors and loves to code.',
    profession: 'Software Developer',
    age: '32',
    interests: ['hiking', 'coding', 'camping']
  };


}