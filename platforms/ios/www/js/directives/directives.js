angular.module('starter.directives', [])

.directive( "progressBar", function() {
    return {
      restrict: "A",
      scope: {selected : "="},
      link: function( scope, element, attrs) {
        $(element).progressbar()
        scope.$watch("selected",function(value){
          if(value != undefined){
            $(element).progressbar("setMaximum", value.total_bets)
            $(element).progressbar("setPosition", value.bets_on_auction)
          }
        })
        scope.$watch("selected.bets_on_auction",function(value){
          if (value != undefined) {
            $(element).progressbar("setPosition", value)
          };
        })

      }
    }
})
.directive ( "editRadius",function(){
  return {
    restrict: "A",
    link: function( scope, element, attrs){
      $(element).find(".progress-bar-danger").css("border-radius","4px")
      $(element).find(".progress").css("border-radius","4px")

    }
  }
})
.directive( "slideDesc", function() {
    return {
      restrict: "A",
      link: function( scope, element, attrs) {
        scope.showd = function(){
          $(element).find(".hide-description").slideToggle(function(){
            if($(element).find("i").hasClass("fa-plus-square-o")){
              $(element).find(".fa-plus-square-o").addClass("fa-minus-square-o").removeClass("fa-plus-square-o");
            }
            else{
              $(element).find(".fa-minus-square-o").addClass("fa-plus-square-o").removeClass("fa-minus-square-o");
            }
          })
        }
      }
    }
})
.directive("clock", function(){
  return {
    restrict: "A",
    scope : { time : "=", params : "=", plus : "="},
    link : function(scope, element, attrs){
      if(scope.params != true ){
        $(".time").append("<div class='countdown' clock time='selected.finish_time'></div>")
      }
      scope.$watch("time",function(value){
        if(value != undefined && value != null){
          var date1 = new Date(); 
          var date2 = new Date(value);
          if(scope.plus === true){
            date2.setDate(date2.getDate()+1)
          }
          function initCount(){
            if(scope.params != true){
              $(element).addClass("active")
            }
            function complete(){
              console.log("time complete")
            }
            $(".countdown").countdown({until: date2, format: 'HMS',compact: true, onExpiry: complete})
          }
          if($(element).hasClass("active")){
            element.empty()
            $(element).append("<div class='countdown'></div>")
            initCount();
          }else{
            initCount();   
            }
        }
      
      });
    }
  }
})
.directive('betManage', function() {
    return {
      restrict: 'A',
      controller : 'BetController',
      templateUrl: 'templates/home/bet_manage.html',
      link: function(scope, element, attrs) {
        scope.amount = 1;
        scope.downBet = function(){
          if(scope.amount > 1){
            scope.amount = scope.amount - 1 
          }
        }
        scope.upBet = function(){
          rest_bets = scope.selected.total_bets - scope.selected.bets_on_auction
          if(scope.amount < rest_bets){
            scope.amount = scope.amount + 1
          }
        }

        scope.$watchCollection("[amount, selected]",function(value){
          if(scope.selected){
            scope.total_coins = scope.amount * scope.selected.tickets_by_bet
            rest_bets = scope.selected.total_bets - scope.selected.bets_on_auction
            if(scope.amount > rest_bets){
              scope.amount = rest_bets
            }
          }
        })
      }
    };
  })
.directive('myLoadingSpinner', function() {
    return {
      restrict: 'A',
      replace: true,
      transclude: true,
      scope: {
        loading: '=myLoadingSpinner'
      },
      templateUrl: 'templates/loading.html',
      link: function(scope, element, attrs) {
        var opts = {color : '#fff'}
        var spinner = new Spinner(opts).spin();
        var loadingContainer = $(element).find(".my-loading-spinner-container")[0];
        loadingContainer.appendChild(spinner.el);
      }
    };
  });
