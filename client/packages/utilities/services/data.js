angular.module('crossover.utilities')
  .factory('data', function(settings) {

    var initInjector = angular.injector(['ng']);
    var $http = initInjector.get('$http');
    var $q = initInjector.get('$q');
    initInjector = angular.injector(['ngStorage']);

    return {
      get: function(url, dataToSend, token) {
        dataToSend = dataToSend || {};
        return $http({
          method: "GET",
          url: url,
          params: dataToSend,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? JSON.stringify(token) : ''
          }
        });
      },
      delete: function(url, dataToSend, token) {
        dataToSend = dataToSend || {};
        return $http({
          method: "DELETE",
          url: url,
          params: dataToSend,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? JSON.stringify(token) : ''
          }
        });
      },
      put: function(url, dataToSend, token) {
        dataToSend = dataToSend || {};

        return $http({
          method: "PUT",
          url: url,
          data: dataToSend,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? JSON.stringify(token) : ''
          }
        });
      },
      post: function(url, dataToSend, token) {
        dataToSend = dataToSend || {};
        return $http({
          method: "POST",
          url: url,
          data: dataToSend,
          headers: {
            'Authorization': token ? JSON.stringify(token) : ''
          }

        });
      }
    };
  });
