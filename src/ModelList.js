;(function(exports) {
    "use strict";

    var isAngular = typeof angular !== "undefined";
    var isNode = typeof module !== "undefined";

    var arrayPrototype = Array.prototype;
    var slice = arrayPrototype.slice;
    var toString = Object.prototype.toString;

    var arrayMethods = [
      "join", "pop", "push", "reverse", "shift", "unshift", 
      "splice", "sort", "forEach", "some", "every", "indexOf", 
      "lastIndexOf", "reduce", "reduceRight"
    ];

    var isDefined = function(value) {
      return typeof value !== "undefined";
    };

    var isFunction = function(fn) {
      return typeof fn === "function";
    };

    var isArray = Array.isArray || function(value) {
      return toString.call(value) === '[object Array]';
    };

    var isObject = function(value) {
      return toString.call(value) === "[object Object]";
    };

    var bind = function(context, fn) {
      return function() {
        return arguments.length ? fn.apply(context, arguments): fn.call(context);
      };
    };

    var chainable = function(context, fn) {
      return function() {
        fn.apply(this, arguments);
        return context;
      };
    };

    var forEach = arrayPrototype.forEach || function(fn, context) {
      for (var i = 0, len = this.length; i < len; i++) {
        fn.call(context, this[i], i);
      }
    };


    var indexOf = arrayPrototype.indexOf || function(element) {
      for (var i = 0, len = this.length; i < len; i++) {
        if (this[i] === element) {
          return i;
        }
      }

      return -1;
    };

    // Quick polyfills for features that aren't supported.
    // These polyfills are just rough barebones implementations.
    // If you need almost native implementation use a proper
    // shim or polyfill.
    var polys = {
      forEach: forEach,
      indexOf: indexOf
    };

    var ModelList = function(array, clone) {
      // We don't want this accessable. No one should be able to modify this directly.
      var list = isArray(array) ? (clone ? array.slice(0) : array) : [];

      this.length = list.length;

      // Copy all native array functions and bind them to our list
      forEach.call(arrayMethods, function(fnName) {
        if (isFunction(arrayPrototype[fnName])) {
          this[fnName] = bind(list, arrayPrototype[fnName]);
        }
      }, this);

      // Bind any polyfills if those functions didn't exist
      for (var name in polys) {
        if (polys.hasOwnProperty(name) && !isFunction(this[name])) {
          this[name] = bind(list, polys[name]);
        }
      }

      // Map normally returns a new instance.
      // We want to keep the same instance so this map function
      // will mutate the array and NOT return a new array.
      this.map = chainable(this, function(fn) {
        for (var i = 0, len = list.length; i < len; i++) {
          list[i] = fn(list[i], i);
        }
      });

      // Slice returns a new array normally. This slice slices the list
      // at the indexes mutating the array. If you need to clone the raw array.
      // use list.getBindableList().slice(0);
      this.slice = chainable(this, function(start, end) {
        end = isDefined(end) ? end : list.length - 1;
        list.splice(0, start);
        list.splice(end, list.length - 1);
      });

      // Concat method that simulates a native concat by pushing all elements
      // of the arrays into the array instance.
      this.concat = chainable(this, function(array) {
        var result = arrayPrototype.concat.apply([], arguments);
        list.push.apply(list, result);
      });

      // Filter normally returns a new array. This will filter the array
      // while retaining the same instance.
      this.filter = chainable(this, function(fn) {
        this.forEach(function(item, index) {
          if (!fn(item, index)) {
            this.pull(item);
          }
        }, this);
      });

      // This is the function that should be used to bind.
      // Normally used for an `ng-repeat` directive.
      this.getBindableList = function() {
        return list;
      };

      this.overwrite = chainable(this, function(array) {
        this.clean();
        this.concat(array);
      });

      this.set = chainable(this, function(item, index) {
        list.splice(index, 1, item);
      });

      // We need to clean the array but still keep the same instance.
      this.clean = chainable(this, function() {
        list.splice(0, list.length);
      });

      this.get = function(index) {
        return list[index];
      };
      
      // Convience method for removing object instances from the array
      this.pull = chainable(this, function() {
        var items = slice.call(arguments, 0);

        for (var i = 0, len = items.length; i < len; i++) {
          list.splice(indexOf.call(list, items[i]), 1);
        }
      });

      // Clones this list and returns a new ModelList
      this.clone = function() {
        return new ModelList(list, true);
      };

      // Wrap each method with a wrapper function that updates the
      // length property
      /* jshint loopfunc: true */
      for (var fnName in this) {
        if (this.hasOwnProperty(fnName)) {
          (function(fn, fnName) {
            if (!isFunction(fn)) {
              return;
            }

            this[fnName] = bind(this, function() {
              var result = fn.apply(this, arguments);

              this.length = list.length;
              return result;
            });
          }.call(this, this[fnName], fnName));
        }
      }
    };

    ModelList.create = function(array, clone) {
      return new ModelList(array, clone);
    };

    // Converts all array instances into ModelList instances
    // on an object. Optional deep conversion.
    ModelList.convert = function(object, deep) {
      for (var key in object) {
        if (object.hasOwnProperty(key)) {
          var item = object[key];

          if (isArray(item)) {
            object[key] = new ModelList(item);

            if (!deep) {
              continue;
            }
            
            // Traverse through the array for objects if deep
            for (var i = 0, len = item.length; i < len; i++) {
              if (isObject(item[i])) {
                ModelList.convert(item[i], deep);
              }
            }
          } else if (isObject(item) && deep) {
            ModelList.convert(item, deep);
          }
        }
      }
    };

    if (isAngular) {
      angular.module("ModelList", []).factory("ModelList", [function() {
        return ModelList;
      }]);
    } else if (isNode) {
      module.exports = ModelList;
    } else {
      exports.ModelList = ModelList;
    }

}(this));
