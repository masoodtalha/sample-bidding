angular.module('crossover.dashboard')
  .controller('dashboardCtrl', ['$scope', '$rootScope', '$http', '$location', '$cookieStore', 'dashboardService',
     '$state', '$mdDialog', '$mdMedia', '$sessionStorage',
    function($scope, $rootScope, $http, $location,  $cookieStore, dashboardService, $state, $mdDialog, $mdMedia, $sessionStorage) {

      	

  		if(!dashboardService.isLoggedIn()){
  			$state.go('home')
  		}

      var username = $sessionStorage.username.name;

  		dashboardService.getAllInventory(username).then(function(data){

  			$scope.inventoryList = data.data;

  			$scope.$apply();
  		});

      dashboardService.fetchCurrentAuction(username).then(function(data){

        if(data.data.username ===null || data.data.username ===undefined){
          $('.auction-box').hide()
        }

        $scope.auctionSellerUsername = data.data.username;
        $scope.auctionItemName = data.data.itemName;
        $scope.auctionMinBid = data.data.minBid;
        $scope.auctionQuantity = data.data.itemQty;
      });

  		$scope.startAuctionPopup = function(itemAmount, itemName){

  				$rootScope.currentAuctionAmount = itemAmount;
  				$rootScope.currentAuctionName = itemName;

  				console.log("available: ", $scope.currentAuctionAmount)

  			    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
			    $mdDialog.show({
			      controller: 'dashboardCtrl',
			      templateUrl: 'packages/dashboard/views/popups/auction.tmpl.html',
			      parent: angular.element(document.body),
			      //targetEvent: ev,
			      clickOutsideToClose:true,
			      fullscreen: useFullScreen
			    })
  		};

  		$scope.startAuction = function(){
  			var inputQty = $scope.quantity;
  			$scope.isQtyExceed = false;
  			$scope.fieldsMissing = false;
        $scope.auctionProgress = false;

  			if($scope.startAuctionForm.$valid){
	  		    if(inputQty > $rootScope.currentAuctionAmount){
	  		    	$scope.isQtyExceed = true;
	  			}

	  			else{
	  				//submit form and create auction
	  				dashboardService.createAuction(username, $scope.minBid, $scope.quantity, $rootScope.currentAuctionName, $rootScope.currentAuctionName).then(function(data){
	  					

              if(data.data.auctionProgress){
                $scope.auctionProgress = true;
              }
              else{
                $mdDialog.hide();
              }

	  			// 		var selectedAuction = _.where($scope.inventoryList, {productName: $rootScope.currentAuctionName});

	  			// 		var match = _.find($scope.inventoryList, function(item) { return item.productName === $rootScope.currentAuctionName })
						// if (match) {
						//     match.quantity = $rootScope.currentAuctionAmount - $scope.quantity;
						// }

						// $scope.$apply();

	  				})
	  			}
  			}
  			else{
  				$scope.fieldsMissing = true;
  				console.log("not valid form")
  			}
  		};

    }
  ]);