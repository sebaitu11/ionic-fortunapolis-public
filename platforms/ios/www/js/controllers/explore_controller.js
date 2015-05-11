
angular.module('starter.controllers')

.controller('ExploreController',['$scope','categoryManager','$location',function($scope,categoryManager,$location) {
  
    $scope.categories = categoryManager.getAll()
    if(_.isEmpty($scope.categories)){
      categoryManager.loadAllCategories().then(function(categories){
        $scope.categories = categories;
      })
    }

  $scope.openAuction = function(auction){
    categoryManager.getAuction(auction)
    $location.path("/tab/home")
  }

}])
