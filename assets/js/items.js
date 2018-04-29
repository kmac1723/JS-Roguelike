/**
 * @Author: Keith Macpherson
 * @Date:   2018-04-29T13:06:17+01:00
 * @Last modified by:   Keith Macpherson
 * @Last modified time: 2018-04-29T17:42:23+01:00
 */

 // Item templates
 Game.ItemRepository = new Game.Repository('items', Game.Item);

 // Description functions
 Game.Item.prototype.describe = function() {
      return this._name;
  };
  Game.Item.prototype.describeA = function(capitalize) {
      // Optional parameter to capitalize the a/an.
      var prefixes = capitalize ? ['A', 'An'] : ['a', 'an'];
      var string = this.describe();
      var firstLetter = string.charAt(0).toLowerCase();
      // If word starts by a vowel, use an, else use a. Note that this is not perfect.
      var prefix = 'aeiou'.indexOf(firstLetter) >= 0 ? 1 : 0;

      return prefixes[prefix] + ' ' + string;
  };

 Game.ItemRepository.define('apple', {
     name: 'apple',
     character: '%',
     foreground: 'red'
 });

 Game.ItemRepository.define('rock', {
     name: 'rock',
     character: '*',
     foreground: 'white'
 });
