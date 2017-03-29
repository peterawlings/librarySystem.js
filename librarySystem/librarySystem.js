(function() {
  var libraryStorage = {};
  function librarySystem(libraryName, dependencies, callback) {
    if (arguments.length > 1) {
      // Create and store the library in a new object
      libraryStorage[libraryName] = {
        dependencies: dependencies,
        callback: callback,
        hasCallBackRun: false
      };
    } else {
      // Else, load the library
      return loadLibrary(libraryName);
    }
  }
  function loadLibrary(libraryName) {
    // Resets to a blank array each time this is run
    var dependenciesArr = [];
    var library = libraryStorage[libraryName];

    // If callback has not run, return dependencies and run those
    if (library.hasCallBackRun === false) {
      dependenciesArr = library.dependencies.map(function(dependency) {
        // returns and runs librarySystem code for each dependecy passed in
        return librarySystem(dependency);
      });
      // Run the callback for the library we are processing and store the returned value
      library.loaded = library.callback.apply(this, dependenciesArr);
      // Change hasCallBackRun to 'true'
      library.hasCallBackRun = true;
    }

    // Returns the result of the callback that has been run (and stored)
    return library.loaded;
  }
  window.librarySystem = librarySystem;

})();

librarySystem('workBlurb', ['name', 'company'], function(name, company) {
  return name + ' works at ' + company;
});

librarySystem('name', [], function() {
  return 'Gordon';
});

librarySystem('company', [], function() {
  return 'Watch and Code';
});

console.log(librarySystem('workBlurb'));


// ==========================
// TESTS
// ==========================

// It should take a libraryName and callback function that stores the library and returns it
// It should accept dependencies in an array, pass into a callback and return it within the library
// It should take an array of dependencies out of order
// It should run a callback function of a library only once, irrespective of how many times it has been called

tests({
  'It should take a libraryName and callback function that stores the library and returns it': function() {
  	librarySystem('app', [], function() {
  		return 'loaded app';
  	});
  	eq(librarySystem('app'), 'loaded app');
	},
  'It should accept dependencies in an array, pass into a callback and return it within the library': function(){
    librarySystem('name', [], function() {
      return 'Gordon';
    });

    librarySystem('company', [], function() {
      return 'Watch and Code';
    });

    librarySystem('workBlurb', ['name', 'company'], function(name, company) {
      return name + ' works at ' + company;
    });
    eq(librarySystem('workBlurb'), 'Gordon works at Watch and Code');
  },
  'It should take an array of dependencies out of order': function(){
    librarySystem('workBlurb2', ['name', 'company'], function(name, company) {
      return name + ' works at ' + company;
    });
    librarySystem('name2', [], function() {
      return 'Gordon';
    });

    librarySystem('company2', [], function() {
      return 'Watch and Code';
    });
    eq(librarySystem('workBlurb'), 'Gordon works at Watch and Code');
  },
  'It should run a callback function of a library only once, irrespective of how many times it has been called': function(){
    var callbackHasRun = 0;

    librarySystem('app2', [], function(){
      callbackHasRun++;
    });

    librarySystem('app2');
    librarySystem('app2');

    eq(callbackHasRun, 1);
  }
});
