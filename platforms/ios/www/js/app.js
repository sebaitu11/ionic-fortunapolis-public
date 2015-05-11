// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ionic.contrib.frostedGlass','ngCookies','starter.controllers','starter.services',
  'starter.directives','angularPayments'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    // StatusBar.hide();
    window.app = {}


    window.app.realtime = {
    connect : function(){
      window.app.socket = io.connect("http://10.0.1.3:5001");
     }
    }

    window.app.realtime.connect()

    Stripe.setPublishableKey('pk_test_f2vQcLZTYssczbFC6hdJWf14')

    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(['$httpProvider','$stateProvider','$urlRouterProvider',function($httpProvider,$stateProvider, $urlRouterProvider) {  
  
  $httpProvider.defaults.useXDomain = true;
  
  delete $httpProvider.defaults.headers.common["X-Requested-With"] 

  $stateProvider
    .state('login',{
      url: "/",
      templateUrl: "templates/login/login.html",
      controller: "LoginCtrl"
    })
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html",
      controller: "menuCtrl"
    })
    // Each tab has its own nav history stack:
    .state('tab.home', {
      url: '/home',
      views: {
        'home': {
          templateUrl:'templates/home/auctions.html',
          controller: 'HomeCtrl'
        }
      }
    })
    .state('tab.explore',{
      url: '/explore',
      views: {
        'explore': {
          templateUrl: 'templates/explore/explore.html',
          controller: "ExploreController"
        }
      }
    })
    .state('tab.auctions', {
      url: '/auctions',
      views: {
        'auctions': {
          templateUrl:'templates/auctions/index.html',
          controller: 'AuctionsCtrl'
        }
      }
    })
    .state('tab.coins', {
      url: '/coins',
      views: {
        'coins': {
          templateUrl:'templates/coins/index.html',
          controller: 'CoinsCtrl'
        }
      }
    })
    .state('tab.profile', {
      url: '/profile',
      views: {
        'profile': {
          templateUrl: 'templates/profile/profile.html',
          controller: 'ProfileController'
          }
        }
      })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');

}]);

