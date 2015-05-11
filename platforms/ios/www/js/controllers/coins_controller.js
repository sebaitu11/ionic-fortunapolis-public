angular.module('starter.controllers')


.controller('CoinsCtrl',['$scope','Payment','Coins','AuthService','$rootScope','$ionicModal',function($scope,Payment,Coins,AuthService,rootScope,$ionicModal) {
    $scope.basic = []
    $scope.medium = []
    $scope.advanced = []

    $scope.basic.coins = 5;
    $scope.medium.coins = 20;
    $scope.advanced.coins = 50;

    $scope.basic.value = 20
    $scope.medium.value = 50
    $scope.advanced.value = 80

    $scope.user = AuthService._user


    $ionicModal.fromTemplateUrl('templates/coins/buyModal.html', {
      scope: $scope,
      animation: 'slide-in-up',
      focusFirstInput: false
      }).then(function(modal) {
        $scope.modal = modal;
      });

    $scope.openModal = function(pack){
      $scope.data = pack
      $scope.data.total = AuthService._user.tickets + $scope.data.coins
      $scope.modal.show()
    }

    $scope.handleStripe = function(status, response){
          var spinner = new Spinner().spin();
          var loadingContainer = $(".spiner-append")[0];
          loadingContainer.appendChild(spinner.el);
          
          if(response.error) {
          } else {
            token = response.id
            value = $scope.data.value + "00"
            Payment.charge(token,value).then(function(response){
              Coins($scope.data.coins,AuthService._user.id).then(function(response){
                $scope.modal.hide()
                rootScope.$broadcast('coins:buy',response)
              })
            })
          }
        }
          
}])


