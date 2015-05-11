angular.module('starter.controllers')

.controller('ModalBet',['$scope','categoryManager','Bets','AuthService','$rootScope','$ionicPopup','$timeout','emailBets','$location',function($scope,categoryManager,Bets,AuthService,rootScope,$ionicPopup,$timeout,emailBets,$location){
    

   $scope.showAlert = function() {
     var alertPopup = $ionicPopup.show({
       title: 'Your bid was succesfully created',
     });
      alertPopup.then(function() {
      });
      $timeout(function() {
        alertPopup.close();
      }, 1500);
    }; 


   $scope.submitBets = function(){
      var spinner = new Spinner().spin();
      var loadingContainer = $(".loading-bets")[0];
      loadingContainer.appendChild(spinner.el);
      $(".container-bet-modal").css("-webkit-filter","blur(2px)")

      data = { amount : $scope.amount, user_id : AuthService._user.id, auction_id : $scope.selected.id}
      Bets(data).then(function(response){    
        emailBets(data).then(function(response){
        })

        spinner.stop()
        $(".container-bet-modal").css("-webkit-filter","blur(0px)")

        data = _.pluck(response,'data')
        auctions = _.pluck(data,'auctions')
        coins = _.pluck(data,'tickets')
        bets_on_auction = _.pluck(data,'bets_on_auction')
        bets = _.max(bets_on_auction);
        auction = _.max(auctions);
        total_coins = _.min(coins);
        close_time =_.pluck(data,"auction")

        _.each(close_time,function(a){ if(a != null){ this.time = a}})

        categoryManager.updateSingleAuction($scope.selected,bets)
        categoryManager.updateSingleAuctionTime($scope.selected,this.time)
        

        rootScope.$broadcast('coins:change',total_coins);
        rootScope.$broadcast('auctions:change',auction);
        
        if (bets === 0){
          $scope.selected.bets_on_auction = 1
        }else{
          $scope.selected.bets_on_auction = bets
        }

        $scope.modal.hide()
        $scope.showAlert()

        if($scope.selected.bets_on_auction === $scope.selected.total_bets){
          $scope.selected.state = "closed"
          $location.path('/tab/auctions')
        }
      })
    }

}])
.controller('BetController',['$scope','$ionicModal',function($scope,$ionicModal){

  $ionicModal.fromTemplateUrl('templates/home/bet_modal.html', {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: false
    }).then(function(modal) {
      $scope.modal = modal;
    });

  $scope.openModal = function(){
    $scope.modal.show()
  }

}])