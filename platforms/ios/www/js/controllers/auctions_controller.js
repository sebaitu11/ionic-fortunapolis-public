angular.module('starter.controllers')

.controller('AuctionsCtrl',['$scope','categoryManager','AuthService','$location','categoryManager', function($scope,Categories,AuthService,$location,categoryManager) {
  $scope.viewLoading = true;
  Categories
    
    .getUserAuctions(AuthService._user.id)
    .then(function(response){
      $scope.viewLoading = false;
      data = _.flatten(response)

      open = _.filter(data,function(d){
        return d.state === "open"
      })

      $scope.closed = _.difference(data,open)

      $scope.auctions = _.filter(open,function(d){
        return d.bets_on_auction <= 2
      })
      $scope.closest = _.filter(open, function(d){
        return d.bets_on_auction > 2
      })
    })
    categoryManager.getUserFinishedAuctions(AuthService._user.id)
    .then(function(response){
      $scope.viewLoading = false;
      $scope.finished = response
    })

  $scope.predicate = "-bets_on_auction"

  $scope.openAuction = function(auction){
    categoryManager.getAuction(auction)
    $location.path("/tab/home")
  }

}])