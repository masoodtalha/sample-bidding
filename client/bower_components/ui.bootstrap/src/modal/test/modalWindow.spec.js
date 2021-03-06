describe('modal window', function() {
  var $rootScope, $compile;

  beforeEach(module('ui.bootstrap.modal'));
  beforeEach(module('template/modal/window.html'));
  beforeEach(inject(function (_$rootScope_, _$compile_) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
  }));

  it('should not use transclusion scope for modals content - issue 2110', function() {
    $rootScope.animate = false;
    $compile('<div uib-modal-window animate="animate"><span ng-init="foo=true"></span></div>')($rootScope);
    $rootScope.$digest();

    expect($rootScope.foo).toBeTruthy();
  });

  it('should support custom CSS classes as string', function() {
    $rootScope.animate = false;
    var windowEl = $compile('<div uib-modal-window animate="animate" window-class="test foo">content</div>')($rootScope);
    $rootScope.$digest();

    expect(windowEl).toHaveClass('test');
    expect(windowEl).toHaveClass('foo');
  });

  it('should support window top class', function () {
    $rootScope.animate = false;
    var windowEl = $compile('<div uib-modal-window animate="animate" window-top-class="test foo">content</div>')($rootScope);
    $rootScope.$digest();

    expect(windowEl).toHaveClass('test');
    expect(windowEl).toHaveClass('foo');
  });

  it('should support custom template url', inject(function($templateCache) {
    $templateCache.put('window.html', '<div class="mywindow" ng-transclude></div>');

    var windowEl = $compile('<div uib-modal-window template-url="window.html" window-class="test">content</div>')($rootScope);
    $rootScope.$digest();

    expect(windowEl).toHaveClass('mywindow');
    expect(windowEl).toHaveClass('test');
  }));
});
