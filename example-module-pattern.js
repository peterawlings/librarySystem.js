// Current approach. One global variable per library.
// 1. Create: Run library in IIFE, and attach to window
// 2. Use: Access library from window

// (function(){
//   // sandwich.js: A simple library for sandwich ingredients.
//   // Demo usage: sandwichLibrary.breads.wheat ===> 'The healthy option'
//   var breads = {
//     wheat: 'The healthy option',
//     white: 'The unhealthy option'
//   };
//   var fillings = {
//     turkey: 'For boring sandwiches',
//     cheese: 'For the vegetarians'
//   };
//   var sandwichLibrary = {
//     breads: breads,
//     fillings: fillings
//   };
//   // exposes the sandwichLibrary object to the window object by attaching it to window object
//   window.sandwichLibrary = sandwichLibrary;
// })();
// // sandwichLibrary.breads.wheat



// ======================================
// Another approach. One global variable period.
// Create: librarySystem('libraryName, function(){ /* return library */}');
// Use: librarySystem('libraryName');
(function() {

  var libraryStorage = {};

  function librarySystem(libraryName, callback) {
    if (arguments.length > 1) {
      // creating a library
      // Setting a new property on 'libraryStorage' which is equal to the return value of the callback function. In this case, it returns the 'sandwichLibrary' object.
      libraryStorage[libraryName] = callback();
    } else {
      // If library already exists
      return libraryStorage[libraryName];
    }
  }
  window.librarySystem = librarySystem;
})();

// Creates the library
librarySystem('sandwichLibrary', function(){
  // sandwich.js: A simple library for sandwich ingredients.
  // Demo usage: sandwichLibrary.breads.wheat ===> 'The healthy option'
  var breads = {
    wheat: 'The healthy option',
    white: 'The unhealthy option'
  };
  var fillings = {
    turkey: 'For boring sandwiches',
    cheese: 'For the vegetarians'
  };
  var sandwichLibrary = {
    breads: breads,
    fillings: fillings
  };
  return sandwichLibrary;
});

// Then can do
(function(){
  // This gets the object (the sandwichLibrary object which was returned) that was stored in the 'libraryStorage' object, under the 'sandwichLibrary' property
  var sandwichLibrary = librarySystem('sandwichLibrary');
  console.log(sandwichLibrary); // displays the sandwichLibrary object
})();

window.sandwichLibrary = "old sandwichLibrary";
// To allow for either approach - meaning librarySystem does not exist...
(function(){
  var breads = {
    wheat: 'The healthy option',
    white: 'The unhealthy option'
  };
  var fillings = {
    turkey: 'For boring sandwiches',
    cheese: 'For the vegetarians'
  };
  var sandwichLibrary = {
    breads: breads,
    fillings: fillings
  };

  if (typeof librarySystem !== 'undefined') {
    // Handle librarySystem case
    librarySystem('sandwichLibrary', function() {
      // This is returning the object (above)
      return sandwichLibrary;
    });
  } else {
    // Handle window case
    var oldSandwichLibrary = window.sandwichLibrary; // store previously set value in a variable
    // How to deal with a conflict if window.sandwichLibrary already has a previous value set

    sandwichLibrary.noConflict = function(){ // Add new property (function) to sandwichLibrary (within this scope)
      window.sandwichLibrary = oldSandwichLibrary; // Set window.sandwichLibrary to the old value
      return sandwichLibrary; // return the object available in the closure 'line 87'
    };// You then set the return value of this to a new variable (sandwichJS - line 114)

    window.sandwichLibrary = sandwichLibrary; // set window.sandwichLibrary to returned value (which is the object within this closure)

  }
})();
// This will reset window.sandwichLibrary to the original value.
// .noConflict will also return the sandwichLibrary
console.log(sandwichLibrary);

var sandwichJS = sandwichLibrary.noConflict();

// You want to print window.sandwichLibrary (you want the string).
console.log(sandwichLibrary);

// We can still use SandwichJS.
console.log(SandwichJS.breads.white);
