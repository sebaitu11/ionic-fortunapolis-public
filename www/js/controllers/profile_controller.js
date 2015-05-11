angular.module('starter.controllers')

.controller('ProfileController',['$scope','AuthService','UserService','$location','$ionicPopup','$timeout',function($scope,AuthService,UserService,$location,$ionicPopup,$timeout) {

  $scope.user = AuthService._user

  $scope.logOut = function(){
    UserService.logout().then(function(response){
      $location.path("/")
    })
  };

  $scope.showAlert = function() {
       var alertPopup = $ionicPopup.show({
         title: 'You Profile was Updated',
       });
        alertPopup.then(function() {
        });
        $timeout(function() {
          alertPopup.close();
        }, 2000);
      };      

  $scope.updateUser = function(params){
    UserService.updateUser(params).then(function(response){
     $scope.showAlert()
    })
  }

}])