/**
 * @Author: Keith Macpherson
 * @Date:   2018-05-12T20:19:38+01:00
 * @Last modified by:   Keith Macpherson
 * @Last modified time: 2018-05-24T12:44:40+01:00
 */

// Screens for managing inventory, equipping items, etc.

// NOTE: defined as constructors, rather than objects like the play scrren

 Game.Screen.ItemListScreen = function(template) {
     // Set up based on the template
     this._caption = template['caption'];
     this._okFunction = template['ok'];
     // By default, we use the identity function
     this._isAcceptableFunction = template['isAcceptable'] || function(x) {
         return x;
     }
     // Whether the user can select items at all.
     this._canSelectItem = template['canSelect'];
     // Whether the user can select multiple items.
     this._canSelectMultipleItems = template['canSelectMultipleItems'];
     // Whether a 'no item' option should appear.
     this._hasNoItemOption = template['hasNoItemOption'];
 };

 Game.Screen.ItemListScreen.prototype.setup = function(player, items) {
     this._player = player;
     // Should be called before switching to the screen.
     var count = 0;
     // Iterate over each item, keeping only the aceptable ones and counting
     // the number of acceptable items.
     var that = this;
     this._items = items.map(function(item) {
         // Transform the item into null if it's not acceptable
         if (that._isAcceptableFunction(item)) {
             count++;
             return item;
         } else {
             return null;
         }
     });
     // Clean set of selected indices
     this._selectedIndices = {};
     return count;
 };

 Game.Screen.ItemListScreen.prototype.render = function(display) {
     var letters = 'abcdefghijklmnopqrstuvwxyz';
    // Render the caption in the top row
    display.drawText(0, 0, this._caption);
    // Render the no item row if enabled
    if (this._hasNoItemOption) {
        display.drawText(0, 1, '0 - no item');
    }
    var row = 0;
    for (var i = 0; i < this._items.length; i++) {
        // If we have an item, we want to render it.
        if (this._items[i]) {
            // Get the letter matching the item's index
            var letter = letters.substring(i, i + 1);
            // If we have selected an item, show a +, else show a dash between
            // the letter and the item's name.
            var selectionState = (this._canSelectItem && this._canSelectMultipleItems &&
                this._selectedIndices[i]) ? '+' : '-';
            // Check if the item is worn or wielded
            var suffix = '';
            if (this._items[i] === this._player.getArmor()) {
                suffix = ' (wearing)';
            } else if (this._items[i] === this._player.getWeapon()) {
                suffix = ' (wielding)';
            }
            // Render at the correct row and add 2.
            display.drawText(0, 2 + row,  letter + ' ' + selectionState + ' ' +
                this._items[i].describe() + suffix);
            row++;
        }
    }
 };

 Game.Screen.ItemListScreen.prototype.executeOkFunction = function() {
     // Gather the selected items.
     var selectedItems = {};
     for (var key in this._selectedIndices) {
         selectedItems[key] = this._items[key];
     }
     // Switch back to the play screen.
     Game.Screen.playScreen.setSubScreen(undefined);
     // Call the OK function and end the player's turn if it return true.
     if (this._okFunction(selectedItems)) {
         this._player.getMap().getEngine().unlock();
     }
 };
 Game.Screen.ItemListScreen.prototype.handleInput = function(inputType, inputData) {
     if (inputType === 'keydown') {
         // If the user hit escape, hit enter and can't select an item, or hit
         // enter without any items selected, simply cancel out
         if (inputData.keyCode === ROT.VK_ESCAPE ||
             (inputData.keyCode === ROT.VK_RETURN &&
                 (!this._canSelectItem || Object.keys(this._selectedIndices).length === 0))) {
             Game.Screen.playScreen.setSubScreen(undefined);
         // Handle pressing return when items are selected
         } else if (inputData.keyCode === ROT.VK_RETURN) {
             this.executeOkFunction();
             // Handle pressing zero when 'no item' selection is enabled
          } else if (this._canSelectItem && this._hasNoItemOption && inputData.keyCode === ROT.VK_0) {
               this._selectedIndices = {};
               this.executeOkFunction();
         // Handle pressing a letter if we can select
         } else if (this._canSelectItem && inputData.keyCode >= ROT.VK_A &&
             inputData.keyCode <= ROT.VK_Z) {
             // Check if it maps to a valid item by subtracting 'a' from the character
             // to know what letter of the alphabet we used.
             var index = inputData.keyCode - ROT.VK_A;
             if (this._items[index]) {
                 // If multiple selection is allowed, toggle the selection status, else
                 // select the item and exit the screen
                 if (this._canSelectMultipleItems) {
                     if (this._selectedIndices[index]) {
                         delete this._selectedIndices[index];
                     } else {
                         this._selectedIndices[index] = true;
                     }
                     // Redraw screen
                     Game.refresh();
                 } else {
                     this._selectedIndices[index] = true;
                     this.executeOkFunction();
                 }
             }
         }
     }
 };

 // ============================================
 // Throwable items list screen
 Game.Screen.throwableItemScreen = new Game.Screen.ItemListScreen({
   caption: 'Select item to throw',
   canSelect: true,
   canSelectMultipleItems: false,
   isAcceptable: function(item){
     return item && item.hasMixin('Throwable');
   },
   ok: function(selectedItems){
     // Once an item is selected, Setup the targetting screen.
     var offsets = Game.Screen.playScreen.getScreenOffsets();
     Game.Screen.targetScreen.setup(this._player,
         this._player.getX(), this._player.getY(),
         offsets.x, offsets.y);

     // set item key as the only element of selctedItems array.
     var key = Object.keys(selectedItems)[0];
     Game.Screen.targetScreen.setThrowItem(key);
     Game.Screen.playScreen.setSubScreen(Game.Screen.targetScreen);
   }
 })

// ====================================
// Inventory display screen.
 Game.Screen.inventoryScreen = new Game.Screen.ItemListScreen({
     caption: 'Inventory',
     canSelect: false
 });

// ============================================
// Pickup screen for collecting multiple items on a tile.
 Game.Screen.pickupScreen = new Game.Screen.ItemListScreen({
     caption: 'Choose the items you wish to pickup',
     canSelect: true,
     canSelectMultipleItems: true,
     ok: function(selectedItems) {
         // Try to pick up all items, messaging the player if they couldn't all be
         // picked up.
         if (!this._player.pickupItems(Object.keys(selectedItems))) {
             Game.sendMessage(this._player, "Your inventory is full! Not all items were picked up.");
         }
         return true;
     }
 });

// ====================================
// Drop items
 Game.Screen.dropScreen = new Game.Screen.ItemListScreen({
     caption: 'Choose the item you wish to drop',
     canSelect: true,
     canSelectMultipleItems: false,
     ok: function(selectedItems) {
         // Drop the selected item
         this._player.dropItem(Object.keys(selectedItems)[0]);
         return true;
     }
 });

// =======================================
// Eat edible items
 Game.Screen.eatScreen = new Game.Screen.ItemListScreen({
     caption: 'Choose the item you wish to eat',
     canSelect: true,
     canSelectMultipleItems: false,
     isAcceptable: function(item) {
         return item && item.hasMixin('Edible');
     },
     ok: function(selectedItems) {
         // Eat the item, removing it if there are no consumptions remaining.
         var key = Object.keys(selectedItems)[0];
         var item = selectedItems[key];
         Game.sendMessage(this._player, "You eat %s.", [item.describeThe()]);
         item.eat(this._player);
         if (!item.hasRemainingConsumptions()) {
             this._player.removeItem(key);
         }
         return true;
     }
 });

 // ======================================
// Wield weapons
 Game.Screen.wieldScreen = new Game.Screen.ItemListScreen({
    caption: 'Choose the item you wish to wield',
    canSelect: true,
    canSelectMultipleItems: false,
    hasNoItemOption: true,
    isAcceptable: function(item) {
        return item && item.hasMixin('Equippable') && item.isWieldable();
    },
    ok: function(selectedItems) {
        // Check if we selected 'no item'
        var keys = Object.keys(selectedItems);
        if (keys.length === 0) {
            this._player.unwield();
            Game.sendMessage(this._player, "You are empty handed.")
        } else {
            // Make sure to unequip the item first in case it is the armor.
            var item = selectedItems[keys[0]];
            this._player.unequip(item);
            this._player.wield(item);
            Game.sendMessage(this._player, "You are wielding %s.", [item.describeA()]);
        }
        return true;
    }
});

// ====================================
// Wearable items
Game.Screen.wearScreen = new Game.Screen.ItemListScreen({
    caption: 'Choose the item you wish to wear',
    canSelect: true,
    canSelectMultipleItems: false,
    hasNoItemOption: true,
    isAcceptable: function(item) {
        return item && item.hasMixin('Equippable') && item.isWearable();
    },
    ok: function(selectedItems) {
        // Check if we selected 'no item'
        var keys = Object.keys(selectedItems);
        if (keys.length === 0) {
            this._player.unwield();
            Game.sendMessage(this._player, "You are not wearing anthing.")
        } else {
            // Make sure to unequip the item first in case it is the weapon.
            var item = selectedItems[keys[0]];
            this._player.unequip(item);
            this._player.wear(item);
            Game.sendMessage(this._player, "You are wearing %s.", [item.describeA()]);
        }
        return true;
    }
});
