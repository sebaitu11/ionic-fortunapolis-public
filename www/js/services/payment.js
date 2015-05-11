angular.module('starter.services')

.factory('Payment', function($location, $http, $q) {  
        var service = {
            charge: function(token,amount) {
              var deferred = $q.defer()
              $http.post('http://10.0.1.3:3000/charge',{stripeToken: token,amount: amount} )
                  .success(function(response) {
                      // success payment
                      deferred.resolve(response)
                  })
                  .error(function(response){
                    deferred.reject()
                  })
              return deferred.promise;
            }
        };
        return service;
    });