//Setting up route for crossover dashboard
angular.module('crossover.dashboard').config(['$stateProvider', 
  function($stateProvider) {

  	// var _checkUserExist = function(){
  	// 	var $cookieStore=initInjector.get('$cookieStore');
  	// 	var username = $cookieStore.get('username')
  	// 	if(username){
  	// 		return true;
  	// 	}

  	// 	else{
  	// 		return false;
  	// 	}
  	// };

    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'packages/dashboard/views/index.html',
        controller: 'dashboardCtrl',
        resolve: {
        	//isLoggedIn: _checkUserExist()
        }
      })
  }
]);
