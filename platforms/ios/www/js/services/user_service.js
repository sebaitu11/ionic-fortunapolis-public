angular.module('starter.services')
    
    .service('UserService', 
       function($rootScope, $q, $cookieStore, $http, AuthService) {
         this.currentUser = AuthService.currentUser;

         this.updateUser = function(params){
          var d = $q.defer()
          $http({
            url: 'http://10.0.1.3:3000/users/' + params.id,
            method: 'PUT',
            data: {
              user: params
            }
          }).success(function(response){
            if(response.success){
              var user = response.data.user
              debugger
              user.tickets = response.data.tickets
              user.auctions = response.data.auctions
              AuthService.setCurrentUser(user);
              d.resolve(user)
            }else {
              d.reject(response)
            }
          }).error(function(reason){
            d.reject(reason)
          });
          return d.promise;
         }

         this.login = function(params) {
           var d = $q.defer();
           $http({
             url: 'http://10.0.1.3:3000/users/sign_in.json',
             method: 'POST',
             data: {
               user: params
             }
           }).success(function(response) { 
             if(response.success) {
               var user = response.data.user;
               user.tickets = response.data.tickets
               user.auctions = response.data.auctions
               AuthService.setCurrentUser(user);
               d.resolve(user);
             } else {
               d.reject(response)
             }
           }).error(function(reason) { 
             d.reject(reason);
           });
           return d.promise;
         };
         this.logout = function() {
           var d = $q.defer();
           AuthService.removeCurrentUser();
           d.resolve();
           return d.promise;
         };
         this.signup = function(params) {
           var d = $q.defer();
           $http({
             url: 'http://10.0.1.3:3000/users',
             method: 'POST',
             data: {
               user: params
             }
           }).success(function(response) { 
             var user = response.data.user;
             user.auth_token = response.data.auth_token; // talk about this
             AuthService.setCurrentUser(user);
             d.resolve(user);
           }).error(function(reason) { 
             d.reject(reason);
           });
           return d.promise;
         };  
      });