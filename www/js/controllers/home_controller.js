angular.module('starter.controllers')

.controller('HomeCtrl',['$scope','categoryManager','$ionicSlideBoxDelegate','$timeout','$ionicSideMenuDelegate','AuthService','$rootScope',function($scope,categoryManager,$ionicSlideBoxDelegate,$timeout,$ionicSideMenuDelegate,AuthService,$rootScope) {
    $scope.viewLoading = true; 

    window.app.socket.on("rt-change", function(message){
        if(AuthService._user.id != message.obj.user_id){
          categoryManager.updateBets(message);  
          $rootScope.$broadcast('update:bets',message);
          }
      });

    $scope.toggleLeft = function() {
      $ionicSideMenuDelegate.toggleLeft();
    };

    selected = function(){
      $scope.selected = categoryManager.getSelected() 
      $scope.query = $scope.selected.category_id
      categories = $scope.categories[$scope.selected.category_id - 1]
      auction =_.where(categories.auctions,{id : $scope.selected.id})
      index = _.indexOf(categories.auctions,auction[0])
      $timeout(function() {
        $ionicSlideBoxDelegate.slide(index)
        }, 200);  
    }

    if(_.isEmpty(categoryManager.getAll())){
      categoryManager.loadAllCategories(AuthService._user.id).then(function(categories){
      $scope.viewLoading = false;
      _.each(categories,function(cd){ 
        cd.closed = _.filter(cd.auctions,function(cb){return cb.state == "closed"})
        cd.auctions = _.filter(cd.auctions,function(cb){return cb.state == "open"})
      })
      $scope.categories = categories
      
      if(categoryManager.getSelected()){
        selected();
      }else{
        $scope.query = categories[0].id
        $scope.selected = categoryManager.getFirstAuction()
        }
      })  
    
    }else {
      categories = _.flatten(categoryManager.getAll())
      $scope.categories = categories
      $scope.viewLoading = false;
      selected()
    }
    

    $scope.changeCategory = function(value){
      $scope.selected = categoryManager.getFirstFromCategory(value)
      $scope.query = value
      $ionicSideMenuDelegate.toggleLeft();    
    }

    $scope.getAuction = function(auction,auctions){
      index = _.indexOf(auctions,auction)
      $ionicSlideBoxDelegate.slide(index)
      $scope.selected = categoryManager.getAuction(auction)
    }

    $scope.updateSelected = function(data){
      selected = $scope.categories[$scope.query -1].auctions[data]
      $scope.selected = categoryManager.getAuction(selected)
    }

}])