angular.module('starter.controllers')

.controller( 'LoginCtrl',[ '$scope','UserService','$timeout','$location','$ionicPopup', function($scope,UserService,$timeout,$location,$ionicPopup) {
   
   // UserService.currentUser().then(function(response){
   //  if(response){
   //    $location.path("/tab/home")
   //  }
   // })
  $scope.showAlert = function() {
       var alertPopup = $ionicPopup.show({
         title: 'Login Fail',
         subTitle: 'Your email or password are incorrect',
         template : "<i class='fa fa-times'>"
       });
        alertPopup.then(function() {
        });
        $timeout(function() {
          alertPopup.close();
        }, 2000);
    }; 

   $scope.login = function(user){
      UserService.login(user).then(
        function(user) {
          $location.path("/tab/home");
        },
        function (reason) {
          $scope.showAlert()
        });
   }


}])