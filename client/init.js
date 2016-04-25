angular.element(document).ready(function() {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_') {
    window.location.hash = '#!';
  }
});

// Default modules
var modules = ['ngCookies', 'ngResource', 'ngStorage',
  'ui.bootstrap', 'ngAnimate',
  'ui.router', 'crossover.main', 'ngMaterial',

  'crossover.dashboard', 'ngCookies', 'crossover-factory-interceptor'
];

angular.module('crossover', modules);
