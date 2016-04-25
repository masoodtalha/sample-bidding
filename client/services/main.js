angular.module('crossover.main')
  .factory('homePageService', function($http, $cookieStore, $sessionStorage,
    $state) {
    var initInjector = angular.injector(['ng']);
    var $q = initInjector.get('$q');
    var injector = angular.injector(['crossover.utilities']);
    var dataService = injector.get('data');

    return {
      registerOrLogin: function(username) {
        var deferred = $q.defer();
        dataService.post('api/user', {
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
      }
    };
  });
