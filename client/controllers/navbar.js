angular.module('crossover.main')
  .controller('navBarController', ['$scope', '$cookieStore', '$state',
    '$rootScope', '$window', 'homePageService', '$sessionStorage',
    function($scope, $cookieStore, $state, $rootScope, $window,
      homePageService, $sessionStorage) {

      console.log("This is nav bar man")

      if($sessionStorage.username){
        $scope.loggedInUser = $sessionStorage.username.name;
        $scope.showInfo = true;
      }

      $scope.logout = function(){
        delete $sessionStorage.username
        $state.go('home')
      };
    }
  ]);