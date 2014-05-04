angular-modellist
=================

[![Build Status](https://travis-ci.org/steelsojka/angular-modellist.svg?branch=master)](https://travis-ci.org/steelsojka/angular-modellist)
[![NPM version](https://badge.fury.io/js/modellist.svg)](http://badge.fury.io/js/modellist)
[![Coverage Status](https://coveralls.io/repos/steelsojka/angular-modellist/badge.png)](https://coveralls.io/r/steelsojka/angular-modellist)

Why?
----
When storing model data in a service, you most likely will need to bind to it in your view(s).
If we bind this data in multiple places we run the risk of loosing the instance if we aren't careful.

```javascript
var myCtrl1 = function(myService) {
	$scope.arrayData = myService.data;
};

var myCtrl2 = function(myService) {
	$scope.arrayData = myService.data;

	$scope.getNewData = function() {
		$http.get("someUrl").success(res) {
			$scope.arrayData = res; // This causes us to loose our reference
		};
	};
};
```

This service provides an object that wraps an array, but always keeps the same instance when operations are performed on it.

```javascript
// myService.data = new ModelList();

var myCtrl1 = function(myService) {
	$scope.arrayData = myService.data;
};

var myCtrl2 = function(myService) {
	$scope.arrayData = myService.data;

	$scope.getNewData = function() {
		$http.get("someUrl").success(res) {
			$scope.arrayData.overwrite(res); // Now our other controls arrayData updates with this one!
		};
	};
};
```
How To Use: 
-----------

####AngularJS####

Just include the module into your app:

```javascript
angular.module("myApp", ["ModelList"]);
```

Inject:

```javascript
angular.module("myApp", ["ModelList"]).factory("myService", function(ModelList, $http) {
	
	var myService = new ModelList();

	myService.update = function() {
		$http.get("myUrl").success(function(res) {
			myService.overwrite(res.data);
		});
	};
	
	return myService;
})
.controller("myCtrl", function($scope, myService) {
	$scope.myService = myService;
})
.controller("myOtherCtrl", function($scope, myService) {
	$scope.myService = myService;
});
```

Use the `getBindableList` method to bind to directives.

```html
<div ng-controller="myCtrl">
	<div ng-repeat="item in myService.getBindableList()">
	</div>
	<button ng-click="myService.update()">
</div>
<div ng-controller="myOtherCtrl">
	<div ng-repeat="item in myService.getBindableList()">
	<button ng-click="myService.update()">
</div>
```

Both of the `ng-repeat` directives will be in sync when the list is updated.

####NodeJS####

```javascript
var ModelLIst = require("modellist");

var list = new ModelList();
```

####Browser####
The `ModelList` class will be available on the window object

```javascript
var list = new ModelList();
```

API
---

####Native methods:####
Most array methods are supported in their native form except a couple:

- `join`
- `pop`
- `push`
- `reverse`
- `shift`
- `unshift` 
- `splice`
- `sort`
- `forEach`: Uses a minimal implementation if not supported
- `some`
- `every`
- `indexOf`: Uses a minimal implementation if not supported
- `lastIndexOf`
- `reduce`
- `reduceRight`
- `map`: `(Chainable)` Mutates the array and does not return a new array
- `concat`: `(Chainable)` Mutates the array and does not return a new array
- `filter`: `(Chainable)` Mutates the array and does not return a new array
- `slice`: `(Chainable)` Mutates the array and does not return a new array

If your browser doesn't support the method natively, it won't be available.

####Custom methods:#####

- `get(Number:index)`: Gets an item at index
- `set(*, Number:index)`: `(Chainable)` Sets an item at index
- `clean()`: `(Chainable)` Empties the array
- `overwrite(Array:array)`: `(Chainable)` Overwrites the array with the items in the new array
- `clone()`: Returns a new ModelList object with a cloned list
- `getBindableList()`: Returns the array. Only should be used for binding
- `pull(*)`: `(Chainable)` Removes object instances from the array

A `length` property is also kept in sync just like native array behaviour.

####Static methods:####
- `create(Array:array, [Boolean:clone])` Returns a new instance of ModelList
- `convert(Object:object, [Boolean:deep])` Converts all array instances into ModelList instances
