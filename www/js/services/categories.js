angular.module('starter.services')
.factory('categoryManager', ['$http', '$q', 'Category','Auction','AuthService',function($http, $q, Category,Auction, AuthService) {
    var categoryManager = {
        _pool: {},
        _auctions_pool : {},
        _retrieveInstance: function(categoryId, categoryData) {
            var instance = this._pool[categoryId];

            if (instance) {
                instance.setData(categoryData);
            } else {
                instance = new Category(categoryData);
                this._pool[categoryId] = instance;
            }

            return instance;
        },
        _retrieveAuctionInstance: function(auctionId,auctionData) {
            var instance = this._auctions_pool[auctionId];

            if (instance) {
                instance.setData(auctionData);
            } else {
                instance = new Auction(auctionData);
                this._auctions_pool[auctionId] = instance;
            }
            return instance;
        },
        _searchCategories: function(auction) {
            category = this._pool[auction.category_id];
            auctions = category.auctions
            return final_auction = _.where(auctions,{id : auction.id})
            
        },
        _searchCategoriesId: function(category_id,auction_id) {
            category = this._pool[category_id];
            auctions = category.auctions
            return final_auction = _.where(auctions,{id : auction_id})
            
        },
        _load: function(categoryId, deferred) {
            var scope = this;

            $http.get('http://10.0.1.3:3000/categories/' + categoryId)
                .success(function(categoryData) {
                    var category = scope._retrieveInstance(categoryData.id, categoryData);
                    deferred.resolve(category);
                })
                .error(function() {
                    deferred.reject();
                });
        },
        userAuctions: function(user_id){
            var deferred = $q.defer()
            $http.get("http://10.0.1.3:3000/users/" + user_id +"/auctions")
                .success(function(response){
                    deferred.resolve(response)
                })
                .error(function(){
                    deferred.reject();
                })
            return deferred.promise;

        },
        /* Public Methods */
        /* Use this function in order to get instances of all the books */
        loadAllCategories: function(user_id) {
            var deferred = $q.defer();
            var scope = this;
            // AuthService._user.id
            $http({ method: "GET", url: 'http://10.0.1.3:3000/categories/', params : { user_id : user_id}})
                .success(function(categoriesArray) {
                    var categories = [];
                    categoriesArray.forEach(function(categoryData) {
                        var category = scope._retrieveInstance(categoryData.id, categoryData);
                        categories.push(category);
                    });

                    deferred.resolve(categories);
                })
                .error(function() {
                    deferred.reject();
                });
            return deferred.promise;
        },
        /*  This function is useful when we got somehow the category data and we wish to store it or update the pool and get a book instance in return */
        getAuction : function(auction){
          var auction = this._searchCategories(auction)
          this.selected = auction[0]
          return this.selected
        },
        updateSingleAuction : function(auction,user_bets){
          auction = _.where(this._pool[auction.category_id].auctions,{id: auction.id})
          if(user_bets === 0){
            auction[0].user_bets = 1;
          }else {
            auction[0].user_bets = user_bets
          }
        },
        updateSingleAuctionTime : function(auction,time){
          auction = _.where(this._pool[auction.category_id].auctions,{id: auction.id})
          auction[0].closed_time = time
        },
        getAll: function(){
            categories = this._pool
            return categories
        },
        getUserAuctions : function(){
            var finded = []
            var d = $q.defer()
            _.each(this._pool,function(category){ 
                result = _.filter(category.auctions,function(auction){ return auction.user_bets > 0})
                closed_auctions = _.filter(category.closed,function(auction){return auction.user_bets > 0})
                result.push(closed_auctions)
                _.flatten(result)
                finded.push(result)
            })
            d.resolve(finded)
            return d.promise

        },
        getUserFinishedAuctionsFromMemory: function(){
            auctions = this._auctions_pool;
            return auctions
        },
        getUserFinishedAuctions: function(user_id){
            var d = $q.defer()
            var scope = this;
            $http({ method: "GET", url: 'http://10.0.1.3:3000/finished_auctions/' + user_id})
                .success(function(response){
                    auctions = [];
                    response.forEach(function(data){
                      var auction = scope._retrieveAuctionInstance(data.id,data)
                      auctions.push(auction)
                    })
                    d.resolve(auctions)
                })
                .error(function(){
                    d.reject();
                })
            return d.promise;

        },
        getSelected : function(){
            return this.selected
        },
        getFirstAuction: function(){
            this.selected = this._pool[1].auctions[0]
            return this.selected
        },
        getFirstFromCategory: function(id){
            this.selected = this._pool[id].auctions[0]
            return this.selected
        },
        updateBets: function(message){
            auction = this._searchCategoriesId(message.category_id,message.obj.auction_id)
            if(message.bets_on_auction === 0){
                auction[0].bets_on_auction = 1
            }else{
                auction[0].bets_on_auction = message.bets_on_auction
            }
        }

    };
    return categoryManager;
}])

.factory('Category', ['$http', function($http) {
    function Category(categoryData) {
        if (categoryData) {
            this.setData(categoryData);
        }
        // Some other initializations related to book
    };
    Category.prototype = {
        setData: function(categoryData) {
            angular.extend(this, categoryData);
        }
    };
    return Category;
}])

.factory('Auction', ['$http', function($http) {
    function Auction(auctionData) {
        if (auctionData) {
            this.setData(auctionData);
        }
        // Some other initializations related to book
    };
    Auction.prototype = {
        setData: function(auctionData) {
            angular.extend(this, auctionData);
        }
    };
    return Auction;
}])


.factory('Bets', function($http,$q,$location) {
    return function(data){
        var promises = [];
        var bets = [];
        for(i = 0; i < data.amount; i++){
          bet = { user_id : data.user_id, auction_id: data.auction_id }
          bets.push(bet)
        }

        var urlBase = "http://10.0.1.3:3000/bets.json" 
        angular.forEach(bets, function(bet){
          var deferred = $q.defer();
            $http({
                url   : urlBase,
                method: 'POST',
                data  : {user_id : bet.user_id , auction_id : bet.auction_id}
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
})


.factory('emailBets',function($http,$q){
    return function(data){
        var deferred = $q.defer();
        $http({
            url : "http://10.0.1.3:3000/bets/email.json",
            method: "POST",
            data : {amount : data.amount, user_id : data.user_id}
        }).success(function(data){
            deferred.resolve(data)
        }).
        error(function(error){
            deferred.reject(error);
        })
        return deferred.promise
    }
})



