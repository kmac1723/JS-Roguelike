/**
 * @Author: Keith Macpherson
 * @Date:   2018-05-13T14:24:52+01:00
 * @Last modified by:   Keith Macpherson
 * @Last modified time: 2018-05-24T12:43:50+01:00
 */

 // =================================
 // Examine screen
 Game.Screen.examineScreen = new Game.Screen.ItemListScreen({
     caption: 'Choose the item you wish to examine',
     canSelect: true,
     canSelectMultipleItems: false,
     isAcceptable: function(item) {
         return true;
     },
     ok: function(selectedItems) {
         var keys = Object.keys(selectedItems);
         if (keys.length > 0) {
             var item = selectedItems[keys[0]];
             Game.sendMessage(this._player, "It's %s (%s).",
                 [
                     item.describeA(false),
                     item.details()
                 ]);
         }
         return true;
     }
 });

 // ====================================
 // Targetting screen, for moving a cursor across the map to examine cells, etc.
 // TODO: Add screen scrolling to this state, to allow examination of previously
 //      explored tiles.
 Game.Screen.TargetBasedScreen = function(template) {
     template = template || {};
     // By default, our ok return does nothing and does not consume a turn.
     this._okFunction = template['okFunction'] || function(x, y) {
         return false;
     };
     // The defaut caption function simply returns an empty string.
     this._captionFunction = template['captionFunction'] || function(x, y) {
         return '';
     }
 };

 Game.Screen.TargetBasedScreen.prototype.setup = function(player, startX, startY, offsetX, offsetY) {
     this._player = player;
     // Store original position. Subtract the offset to make life easy so we don't
     // always have to remove it.
     this._startX = startX - offsetX;
     this._startY = startY - offsetY;
     // Store current cursor position
     this._cursorX = this._startX;
     this._cursorY = this._startY;
     // Store map offsets
     this._offsetX = offsetX;
     this._offsetY = offsetY;
     // Cache the FOV
     var visibleCells = {};
     this._player.getMap().getFov(this._player.getZ()).compute(
         this._player.getX(), this._player.getY(),
         this._player.getSightRadius(),
         function(x, y, radius, visibility) {
             visibleCells[x + "," + y] = true;
         });
     this._visibleCells = visibleCells;
 };

 Game.Screen.TargetBasedScreen.prototype.render = function(display) {
     Game.Screen.playScreen.renderTiles.call(Game.Screen.playScreen, display);

     // Draw a line from the start to the cursor.
     var points = Game.Geometry.getLine(this._startX, this._startY, this._cursorX,
         this._cursorY);

     // Render stars along the line.
     for (var i = 0, l = points.length; i < l; i++) {
         display.drawText(points[i].x, points[i].y, '%c{magenta}*');
     }

     // Render the caption at the bottom.
     display.drawText(0, Game.getScreenHeight() - 1,
         this._captionFunction(this._cursorX + this._offsetX, this._cursorY + this._offsetY));
 };

 Game.Screen.TargetBasedScreen.prototype.handleInput = function(inputType, inputData) {
     // Move the cursor
     if (inputType == 'keydown') {
         if (inputData.keyCode === ROT.VK_LEFT) {
             this.moveCursor(-1, 0);
         } else if (inputData.keyCode === ROT.VK_RIGHT) {
             this.moveCursor(1, 0);
         } else if (inputData.keyCode === ROT.VK_UP) {
             this.moveCursor(0, -1);
         } else if (inputData.keyCode === ROT.VK_DOWN) {
             this.moveCursor(0, 1);
         } else if (inputData.keyCode === ROT.VK_ESCAPE) {
             Game.Screen.playScreen.setSubScreen(undefined);
         } else if (inputData.keyCode === ROT.VK_RETURN) {
             this.executeOkFunction();
         }
     }
     Game.refresh();
 };

 Game.Screen.TargetBasedScreen.prototype.moveCursor = function(dx, dy) {
     // Make sure we stay within bounds.
     this._cursorX = Math.max(0, Math.min(this._cursorX + dx, Game.getScreenWidth()));
     // We have to save the last line for the caption.
     this._cursorY = Math.max(0, Math.min(this._cursorY + dy, Game.getScreenHeight() - 1));
 };

 Game.Screen.TargetBasedScreen.prototype.executeOkFunction = function() {
     // Switch back to the play screen.
     Game.Screen.playScreen.setSubScreen(undefined);
     // Call the OK function and end the player's turn if it return true.
     if (this._okFunction(this._cursorX + this._offsetX, this._cursorY + this._offsetY)) {
         this._player.getMap().getEngine().unlock();
     }
 };

 // ======================================================
 // Look screen, for examining cells
 Game.Screen.lookScreen = new Game.Screen.TargetBasedScreen({
     captionFunction: function(x, y) {
         var z = this._player.getZ();
         var map = this._player.getMap();
         // If the tile is explored, we can give a better capton
         if (map.isExplored(x, y, z)) {
             // If the tile isn't explored, we have to check if we can actually
             // see it before testing if there's an entity or item.
             if (this._visibleCells[x + ',' + y]) {
                 var items = map.getItemsAt(x, y, z);
                 // If we have items, we want to render the top most item
                 if (items) {
                     var item = items[items.length - 1];
                     return String.format('%s - %s (%s)',
                         item.getRepresentation(),
                         item.describeA(true),
                         item.details());
                 // Else check if there's an entity
                 } else if (map.getEntityAt(x, y, z)) {
                     var entity = map.getEntityAt(x, y, z);
                     return String.format('%s - %s (%s)',
                         entity.getRepresentation(),
                         entity.describeA(true),
                         entity.details());
                 }
             }
             // If there was no entity/item or the tile wasn't visible, then use
             // the tile information.
             return String.format('%s - %s',
                 map.getTile(x, y, z).getRepresentation(),
                 map.getTile(x, y, z).getDescription());

         } else {
             // If the tile is not explored, show the null tile description.
             return String.format('%s - %s',
                 Game.Tile.nullTile.getRepresentation(),
                 Game.Tile.nullTile.getDescription());
         }
     }
 });

 // ==================================
 // Targetting screen, for throwing an object at a location/Entity
  Game.Screen.targetScreen = new Game.Screen.TargetBasedScreen({
      // TODO: Rename throwItem to Key
      _throwItemKey: null,
      okFunction: function(targetX, targetY){
          if(this._throwItemKey && this._player.hasMixin('Thrower')){
              this._player.throw(targetX, targetY, this._player.getZ(), this._throwItemKey);
              return true;
          } else {
              console.log('Player cannot throw item!');
              return false;
          }
      }
  });

  Game.Screen.targetScreen.setThrowItem = function(itemKey){
      this._throwItemKey = itemKey;
  }
