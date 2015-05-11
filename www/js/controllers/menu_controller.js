angular.module('starter.controllers')

.controller('menuCtrl',['$scope','AuthService', function($scope,AuthService) {
    if(AuthService._user !== null ){
      $scope.coins = AuthService._user.tickets
      $scope.auctions_size = AuthService._user.auctions
    }
    $scope.$on("coins:change",function(event,data){
      AuthService._user.tickets = data
      event.currentScope.coins = AuthService._user.tickets
    })
    $scope.$on("coins:buy",function(event,data){
      event.currentScope.coins += data
    })
    $scope.$on("auctions:change",function(event,data){
      event.currentScope.auctions_size = data
    })
}])