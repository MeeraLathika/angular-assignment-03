(function () {
	'use strict';
	
	angular.module('NarrowItDownApp',[])
	.controller('NarrowItDownController',NarrowItDownController)
	.service('MenuSearchService',MenuSearchService)
	.directive('foundItems',FoundItemsDirective);
	
	function FoundItemsDirective(){
		var ddo = {
			restrict : 'E',
			templateURL:'foundItems.html',
			scope: {
				found: '<',
				onRemove: '&',
				empty: '<'
			}
		};
		return ddo;
	}
 
	NarrowItDownController.$inject=['MenuSearchService'];
	function NarrowItDownController(MenuSearchService){
		var ctrl = this;
		
		ctrl.searchTerm = '';
		ctrl.empty = '';
	
		ctrl.searchItem = function (){
			if(ctrl.searchTerm !== ''){
				var promise = MenuSearchService.getMatchedMenuItems(ctrl.searchTerm);
				promise.then(function(result) {
					ctrl.found = result;
					//console.log(ctrl.found);
					//ctrl.empty = MenuSearchService.isEmpty();
				})
					.catch(function(error) {
					console.log(error);
				});
			}
			else {
				ctrl.empty = MenuSearchService.isEmpty();
				console.log(ctrl.empty);
			}
		};
		ctrl.remove = function (itemIndex) {
			return MenuSearchService.removeItem(itemIndex);
		};
	}
		
 
 
	MenuSearchService.$inject = ['$http'];
	function MenuSearchService($http) {
		var service = this;
		var foundItems = [];
		var emptyMessage = 'Nothing Found';
		
		service.getMatchedMenuItems = function (searchTerm) {
			searchTerm = searchTerm.trim().toLowerCase();
			
			return $http ({
				method: "GET",
				url: ("https://davids-restaurant.herokuapp.com/menu_items.json")
			})
				.then(function(response) {
				foundItems=[];
				for(var i=0; i<response.data.menu_items.length; i++) {
					
					if (response.data.menu_items[i].description.toLowerCase().indexOf(searchTerm) !== -1) {
						//console.log("current menu item"+response.data.menu_items[i].description);
						foundItems.push(response.data.menu_items[i]);
					}
				}
				//console.log(foundItems);
				return foundItems;
			}).catch(function(errorResponse) {
				console.log(errorResponse);
			});
		};
		
		service.removeItem = function (itemIndex) {
			foundItems.splice(itemIndex, 1);
			return foundItems;
		};
		
		service.isEmpty = function () {
			console.log(emptyMessage);
			return emptyMessage;
		};
	}
})();