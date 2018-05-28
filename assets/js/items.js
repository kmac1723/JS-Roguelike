/**
 * @Author: Keith Macpherson
 * @Date:   2018-04-29T13:06:17+01:00
 * @Last modified by:   Keith Macpherson
 * @Last modified time: 2018-05-19T10:34:54+01:00
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
     foreground: 'red',
     foodValue: 50,
    mixins: [Game.ItemMixins.Edible]
 });

 Game.ItemRepository.define('melon', {
    name: 'melon',
    character: '%',
    foreground: 'lightGreen',
    foodValue: 35,
    consumptions: 4,
    mixins: [Game.ItemMixins.Edible]
});

 Game.ItemRepository.define('rock', {
     name: 'rock',
     character: '*',
     foreground: 'white',
     thrownAttackValue: 5,
     mixins: [Game.ItemMixins.Throwable]
 });

 Game.ItemRepository.define('corpse', {
    name: 'corpse',
    character: '%',
    foodValue: 75,
    consumptions: 1,
    mixins: [Game.ItemMixins.Edible]
}, {
    disableRandomCreation: true
});

// Weapons
Game.ItemRepository.define('dagger', {
    name: 'dagger',
    character: ')',
    foreground: 'gray',
    attackValue: 5,
    wieldable: true,
    mixins: [Game.ItemMixins.Equippable]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('sword', {
    name: 'sword',
    character: ')',
    foreground: 'white',
    attackValue: 10,
    wieldable: true,
    mixins: [Game.ItemMixins.Equippable]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('staff', {
    name: 'staff',
    character: ')',
    foreground: 'yellow',
    attackValue: 5,
    defenseValue: 3,
    wieldable: true,
    mixins: [Game.ItemMixins.Equippable]
}, {
    disableRandomCreation: true
});

// Wearables
Game.ItemRepository.define('tunic', {
    name: 'tunic',
    character: '[',
    foreground: 'green',
    defenseValue: 2,
    wearable: true,
    mixins: [Game.ItemMixins.Equippable]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('chainmail', {
    name: 'chainmail',
    character: '[',
    foreground: 'white',
    defenseValue: 4,
    wearable: true,
    mixins: [Game.ItemMixins.Equippable]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('platemail', {
    name: 'platemail',
    character: '[',
    foreground: 'aliceblue',
    defenseValue: 6,
    wearable: true,
    mixins: [Game.ItemMixins.Equippable]
}, {
    disableRandomCreation: true
});

// Weird item!
Game.ItemRepository.define('pumpkin', {
    name: 'pumpkin',
    character: '%',
    foreground: 'orange',
    foodValue: 50,
    attackValue: 2,
    defenseValue: 2,
    wearable: true,
    wieldable: true,
    mixins: [Game.ItemMixins.Edible, Game.ItemMixins.Equippable]
});
