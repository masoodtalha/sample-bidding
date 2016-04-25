angular.module('crossover-factory-interceptor', [])
  .factory('httpInterceptor', ['$q', '$location',
    function($q, $state) {
      return {
        'response': function(response) {
          console.log("I am here");
          if (response.status === 401) {
            console.log("I am here");
            $location.path('/');
            return $q.reject(response);
          }
          return response || $q.when(response);
        },

        'responseError': function(rejection) {
          console.log("I am here");
          if (rejection.status === 401) {
            $state.go('home');
            return $q.reject(rejection);
          }
          return $q.reject(rejection);
        }

      };
    }
  ])
  //Http Interceptor to check auth failures for XHR requests
  .config(['$httpProvider',
    function($httpProvider) {
      console.log("interceptor");
      $httpProvider.interceptors.push('httpInterceptor');
    }
  ]);
