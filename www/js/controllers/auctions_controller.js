angular.module('starter.controllers')

.controller('AuctionsCtrl',['$scope','categoryManager','AuthService','$location', function($scope,categoryManager,AuthService,$location) {
  $scope.viewLoading = true;
  categoryManager
    
    .getUserAuctions(AuthService._user.id)
    .then(function(response){
      $scope.viewLoading = false;
      data = _.flatten(response)

      open = _.filter(data,function(d){
        return d.state === "open"
      })
      
      $scope.closed = _.difference(data,open)

      $scope.auctions = open

    })
    $scope.$on("update:bets",function(event,data){
      $scope.$apply()
    })

    if(_.isEmpty(categoryManager.getUserFinishedAuctionsFromMemory())){
      categoryManager.getUserFinishedAuctions(AuthService._user.id)
      .then(function(response){
        $scope.viewLoading = false;
        $scope.finished = response
      })
    }
    else{
      $scope.finished = categoryManager.getUserFinishedAuctionsFromMemory()
    }

  $scope.predicate = "-bets_on_auction"

  $scope.openAuction = function(auction){
    categoryManager.getAuction(auction)
    $location.path("/tab/home")
  }

}])