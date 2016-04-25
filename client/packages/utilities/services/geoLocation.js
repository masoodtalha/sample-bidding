'use strict';

angular.module('crossover.utilities').factory('dhartiUtilities', [

  function() {
    return {
      name: 'utilities'
    };
  }
]);


angular.module('crossover.utilities').factory('geoLocation',['settings',function(settings) {
  	var initInjector = angular.injector(['ng']);
	var $http = initInjector.get('$http');
  var $q=initInjector.get('$q');
	initInjector = angular.injector(['ngCookies']);
	var $cookieStore=initInjector.get('$cookieStore');
    return {
      getLocation: function () {
        var deferred = $q.defer();
        if (window.navigator && window.navigator.geolocation) {
          window.navigator.geolocation.getCurrentPosition(function(pos){
            console.log("We got location:",pos)
            deferred.resolve(pos.coords);
          },function(error) {
            switch(error.code) {
              case error.PERMISSION_DENIED:
                console.log("User denied the request for Geolocation.")
                $cookieStore.put('currentLocation',"");
                deferred.reject("User denied the request for Geolocation.")
                break;
              case error.POSITION_UNAVAILABLE:
                console.log("Location information is unavailable.")
                $cookieStore.put('currentLocation',"");
                deferred.reject("Location information is unavailable.")
                break;
              case error.TIMEOUT:
                console.log("The request to get user location timed out.")
                $cookieStore.put('currentLocation',"");
                deferred.reject("The request to get user location timed out.")
                break;
              case error.UNKNOWN_ERROR:
                console.log("An unknown error occurred.")
                $cookieStore.put('currentLocation',"");
                deferred.reject("An unknown error occurred.")
                break;
            }
          })
        }
        else{
          deferred.reject("Location Service not available");
        }
        return deferred.promise;
      },
      getLocationCookie:function(){
        var temp = $cookieStore.get('currentLocation');
        if(temp && (temp != "")){
          return temp
        }
        else
          return null
      },
      IsLocationCookieAvailable:function(){
        var temp = $cookieStore.get('currentLocation');
        if(temp == ""){
          return true
        }
        else
          return false
      },

    };
  }
]);