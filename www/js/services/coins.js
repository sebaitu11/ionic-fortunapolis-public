angular.module('starter.services')

.factory('Coins', function($location, $http, $q) {  
  return function(amount,user_id) {
    
    var promises = [];
    var coins = [];
    for(i = 0; i < amount; i++){
      coin = { user_id : user_id}
      coins.push(coin)
    }

    var urlBase = "http://10.0.1.3:3000/tickets.json" 
    angular.forEach(coins, function(coin){
      var deferred = $q.defer();
        $http({
            url   : urlBase,
            method: 'POST',
            data  : {user_id : coin.user_id }
        }).
        success(function(data){
            deferred.resolve(data);
        }).
        error(function(error){
            deferred.reject();
        })
        promises.push(deferred.promise); 
    })
    return $q.all(promises);
  }
});