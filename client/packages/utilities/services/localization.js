'use strict';

angular.module('crossover.utilities').factory('localization',['settings',function(settings) {
  	var initInjector = angular.injector(['ng']);
	var $http = initInjector.get('$http');
  var $q=initInjector.get('$q');
	initInjector = angular.injector(['ngCookies']);
	var $cookieStore=initInjector.get('$cookieStore');
    return {
      getTranslations: function(lang){
        console.log(lang,settings.translationFiles[lang]);
        var deferred = $q.defer();
        if(!settings.translationFiles[lang])
          deferred.reject("Language not available")
        $http.get(settings.translationFiles[lang])
          .success(function(response) {
            deferred.resolve(response);
          }).
          error(function(response){
            deferred.reject(response)
          });
        return deferred.promise;
      },  

    };
  }
]);