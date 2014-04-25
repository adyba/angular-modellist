describe("ModelList - Service", function() {
  var ModelList;

  beforeEach(module("ModelList"));

  beforeEach(inject(function($injector) {
    ModelList = $injector.get("ModelList");
  }));

  it("should create an instance of model list", function() {
    expect(new ModelList().getBindableList).toBeDefined();
    expect(ModelList.create().getBindableList).toBeDefined();
  });

  it("should return an array", function() {
    var list = new ModelList();

    expect(angular.isArray(list.getBindableList())).toBe(true);
  });

  it("should use the array passed in to the factory", function() {
    var array = ["hello"];
    var list = new ModelList(array);

    expect(list.getBindableList()).toBe(array);
  });

  it("should clone the passed in array", function() {
    var array = ["hello"];
    var list = new ModelList(array, true);

    expect(list.getBindableList()).not.toBe(array);
  });

  it("should push to the array", function() {
    var list = new ModelList();

    list.push("test");
    expect(list.length).toBe(1);
    expect(list.get(0)).toBe("test");
  });

  it("should pop from the array", function() {
    var list = new ModelList(["test", "woot"]);
    var item = list.pop();

    expect(list.length).toBe(1);
    expect(list.get(0)).toBe("test");
    expect(item).toBe("woot");
  });

  it("should shift the array", function() {
    var list = new ModelList(["test", "woot"]);
    var item = list.shift();

    expect(list.length).toBe(1);
    expect(list.get(0)).toBe("woot");
    expect(item).toBe("test");
  });

  it("should unshift the array", function() {
    var list = new ModelList(["woot"]);

    list.unshift("test");

    expect(list.length).toBe(2);
    expect(list.get(0)).toBe("test");
    expect(list.get(1)).toBe("woot");
});

  it("should splice the array", function() {
    var list = new ModelList(["test", "woot"]);
    var item = list.splice(0, 1);

    expect(list.length).toBe(1);
    expect(angular.isArray(item)).toBe(true);

    list.splice(0, 0, "test");

    expect(list.length).toBe(2);
    expect(list.get(0)).toBe("test");
    expect(list.get(1)).toBe("woot");
  });

  it("should loop over the array", function() {
    var list = new ModelList(["test", "woot"]);
    var spy = jasmine.createSpy();

    list.forEach(spy);

    expect(spy).toHaveBeenCalledWith("test", 0, list.getBindableList());
    expect(spy).toHaveBeenCalledWith("woot", 1, list.getBindableList());
  });

  it("should map the list, but retain the same reference", function() {
    var array = ["test", "woot"];
    var list = new ModelList(array);

    list.map(function(item) {
      return item + "-yes";
    });

    expect(list.get(0)).toBe("test-yes");
    expect(list.get(1)).toBe("woot-yes");

    expect(list.getBindableList()).toBe(array);
  });

  it("should overwrite the array while retaining the same array instance", function() {
    var array = ["test", "woot"];
    var list = new ModelList(array);

    list.overwrite(["boom"]);

    expect(list.get(0)).toBe("boom");
    expect(list.length).toBe(1);
    expect(list.getBindableList()).toBe(array);
  });

  it("should clean the array while retaining the same array instance", function() {
    var array = ["test", "woot"];
    var list = new ModelList(array);

    list.clean();

    expect(list.length).toBe(0);
    expect(list.getBindableList()).toBe(array);
    expect(list.get(0)).toBeUndefined();
  });

  it("should set an item in the list", function() {
    var array = ["test", "woot"];
    var list = new ModelList(array);

    list.set("boom", 1);

    expect(list.length).toBe(3);
    expect(list.getBindableList()).toBe(array);
    expect(list.get(1)).toBe("boom");
  });

  it("should remove an item from the array by instance", function() {
    var item1 = {}, item2 = {};
    var array = [item1, item2];
    var list = new ModelList(array);

    list.pull(item1);

    expect(list.length).toBe(1);
    expect(list.get(0)).toBe(item2);
  });

  it("should concat to the array", function() {
    var array = ["test"];
    var list = new ModelList(array);

    list.concat(["boo"], ["yes"]);

    expect(list.length).toBe(3);

    expect(list.get(0)).toBe("test");
    expect(list.get(1)).toBe("boo");
    expect(list.get(2)).toBe("yes");
    expect(list.getBindableList()).toBe(array);
  });

  it("should filter the array", function() {
    var array = ["test", "item1", "item2"];
    var list = new ModelList(array);

    list.filter(function(item) {
      return item !== "item1";
    });

    expect(list.length).toBe(2);
    expect(list.get(0)).toBe("test");
    expect(list.get(1)).toBe("item2");
    expect(list.getBindableList()).toBe(array);
  });

  it("should clone the list", function() {
    var array = ["test"];

    var list = new ModelList(array);
    var clone = list.clone();

    expect(list.getBindableList()).not.toBe(clone.getBindableList());
  });

  it("should slice the array and mutate it", function() {
    var array = ["test1", "test2", "test3", "test4", "test5"];
    var list = new ModelList(array);
    
    list.slice(1);

    expect(list.length).toBe(4);
    expect(list.get(0)).toBe("test2");
    expect(list.getBindableList()).toBe(array);

    list.unshift("test1");

    expect(list.length).toBe(5);

    list.slice(1, 3);
    expect(list.length).toBe(3);

    expect(list.get(0)).toBe("test2");
    expect(list.get(1)).toBe("test3");
    expect(list.get(2)).toBe("test4");
  });
});