angular.module('crossover.dashboard')
  .factory('dashboardService', function($http, $cookieStore, $sessionStorage,
    $state) {
    var initInjector = angular.injector(['ng']);
    var $q = initInjector.get('$q');
    var injector = angular.injector(['crossover.utilities']);
    var dataService = injector.get('data');

    return {

      isLoggedIn: function() {
        if ($sessionStorage.username) {
          return true;
        } else {
          return false;
        }
      },

      getAllInventory: function(username) {
        var deferred = $q.defer();
        dataService.get('api/user/' + username + '/inventory', {
          'username': username
        }, $sessionStorage.username).then(function(data) {
          deferred.resolve(data.data);
        }, function(err) {
          if (err.status === 401) {
            $state.go('home');
          }
          deferred.reject(err);
        });
        return deferred.promise;
      },

      createAuction: function(username, minBid, qty, itemType, itemName) {
        var deferred = $q.defer();
        dataService.get('api/createauction', {
          'username': username,
          'itemType': itemType,
          'itemName': itemName,
          'itemQty': qty,
          'minBid': minBid
        }, $sessionStorage.username).then(function(data) {
          deferred.resolve(data.data);
        }, function(err) {
          deferred.reject(err);
        });
        return deferred.promise;
      },

      fetchCurrentAuction: function(username){
          
        var deferred = $q.defer();
        dataService.get('api/getauction', {
          'username': username,
        }, $sessionStorage).then(function(data) {
          deferred.resolve(data.data);
        }, function(err) {
          deferred.reject(err);
        });
        return deferred.promise;

      }
    };
  });
