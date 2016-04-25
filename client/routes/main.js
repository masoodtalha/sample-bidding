angular.module('crossover.main').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {

    // For unmatched routes
    $urlRouterProvider.otherwise('/');

    // states
    $stateProvider

      .state('home', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'homeController'
      })
      .state('about', {
        url: '/about',
        templateUrl: 'views/aboutUs.html',
        resolve: {}
      });
  }
]).config(['$locationProvider',
  function($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
