angular.module('crossover.main')
  .controller('homeController', ['$scope', '$cookieStore', '$state',
    '$rootScope', '$window', 'homePageService', '$sessionStorage',
    function($scope, $cookieStore, $state, $rootScope, $window,
      homePageService, $sessionStorage) {
      $scope.loginOrRegister = function() {
        if ($scope.userLoginForm.$valid) {
          homePageService.registerOrLogin($scope.username.trim()).then(
            function(data) {
              $sessionStorage.username = {
                name: data.data.username,
                userId: data.data.userId,
                sessionId: data.data.sessionId
              };
              //$sessionStorage.username.name
              $state.go('dashboard');
              //delete $sessionStorage.username
            });
        } else {
          $scope.userFormSubmitted = true;
        }

      };
    }
  ]);

angular.module('crossover').controller('SuperMainController', ['$scope',
  '$state', '$rootScope', '$cookieStore', '$location', '$window',
  '$sessionStorage',
  function($scope, $state, $rootScope, $cookieStore, $location, $window,
    $sessionStorage) {
    $rootScope.statesRecord = [];

    $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from,
      fromParams) {
      $rootScope.previousState = from.name;
      $rootScope.currentState = to.name;
      $rootScope.previousParams = fromParams;
      $rootScope.currentParams = toParams;
      $rootScope.statesRecord.push({
        'state': $rootScope.previousParams,
        'params': $rootScope.previousParams
      });
      console.log('Previous state:', $rootScope.previousState,
        $rootScope.previousParams);
      console.log('Current state:', $rootScope.currentState, $rootScope
        .currentParams);
    });

    $rootScope.signOut = function() {
      $rootScope.$broadcast('logout', null);
    };

    $scope.goToLogin = function() {
      $state.go('auth.account.login');
    };

    var loadLoggedInUser = function() {
      //   superService.isLoggedIn().then(function(data){
      // $rootScope.loggedInUser = data;
      //   },function(err){
      //       console.log("Error: ", err);
      //   })
    };
    console.log("logged in user is: ", $sessionStorage.username);

    //  $rootScope.$on('logout', function(event, mass) {
    // $rootScope.loggedInUser=null;

    //    superService.logout().then(function(data){
    // 	$rootScope.loggedInUser=null;
    // 	console.log("Backend logout success: ");
    //    },function(err){
    //        console.log("Error: ", err);
    //    });
    // $state.go('home');
    //  });
  }
]);
