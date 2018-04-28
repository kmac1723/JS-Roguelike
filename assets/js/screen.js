/**
 * @Author: Keith Macpherson
 * @Date:   2018-04-27T14:07:43+01:00
 * @Last modified by:   Keith Macpherson
 * @Last modified time: 2018-04-28T20:52:38+01:00
 */
 Game.Screen = {};

 // Define our initial start screen
 Game.Screen.startScreen = {
     enter: function() {    console.log("Entered start screen."); },
     exit: function() { console.log("Exited start screen."); },
     render: function(display) {
         // Render our prompt to the screen
         display.drawText(1,1, "%c{yellow}Javascript Roguelike");
         display.drawText(1,2, "Press [Enter] to start!");
     },
     handleInput: function(inputType, inputData) {
         // When [Enter] is pressed, go to the play screen
         if (inputType === 'keydown') {
             if (inputData.keyCode === ROT.VK_RETURN) {
                 Game.switchScreen(Game.Screen.playScreen);
             }
         }
     }
 }

 // Define our playing screen
 Game.Screen.playScreen = {
     map : null,
     _player: null,
     enter: function() {
         console.log("Entered play screen.");
         // Create a map based on our size parameters
        var width = 100;
        var height = 48;
        var depth = 6;
        // Create our map from the tiles and player
        var tiles = new Game.Builder(width, height, depth).getTiles();
        this._player = new Game.Entity(Game.PlayerTemplate);
        this._map = new Game.Map(tiles, this._player);
        //this._map = new Game.Map(map, this._player);
        // Start the map's engine
        this._map.getEngine().start();
     },
     exit: function() { console.log("Exited play screen."); },
     render: function(display) {
        var screenWidth = Game.getScreenWidth();
        var screenHeight = Game.getScreenHeight();
        // Make sure the x-axis doesn't go to the left of the left bound
         var topLeftX = Math.max(0, this._player.getX() - (screenWidth / 2));
        // Make sure we still have enough space to fit an entire game screen
        topLeftX = Math.min(topLeftX, this._map.getWidth() - screenWidth);
        // Make sure the y-axis doesn't above the top bound
         var topLeftY = Math.max(0, this._player.getY() - (screenHeight / 2));
        // Make sure we still have enough space to fit an entire game screen
        topLeftY = Math.min(topLeftY, this._map.getHeight() - screenHeight);
        // This object will keep track of all visible map cells
        // NOTE: Uses a Javascript Hashmap to track whether a cell should be rendered
        // NOTE: Could be replaced with a more efficient method.
        var visibleCells = {};
        // Store this._map and player's z to prevent losing it in callbacks
        var map = this._map;
        var currentDepth = this._player.getZ();
        // Find all visible cells and update the object
        map.getFov(currentDepth).compute(
            this._player.getX(), this._player.getY(),
            this._player.getSightRadius(),
            function(x, y, radius, visibility) {
                visibleCells[x + "," + y] = true;
                // Mark cell as explored
                map.setExplored(x, y, currentDepth, true);
            });
        // Iterate through all visible map cells
        for (var x = topLeftX; x < topLeftX + screenWidth; x++) {
            for (var y = topLeftY; y < topLeftY + screenHeight; y++) {
                // Render the explored map cells
                if (map.isExplored(x, y, currentDepth)) {
                  // Fetch the glyph for the tile and render it to the screen
                  // at the offset position.
                  var tile = this._map.getTile(x, y, currentDepth);
                  // The foreground color becomes dark gray if the tile has been
                  // explored but is not visible
                  var foreground = visibleCells[x + ',' + y] ?
                      tile.getForeground() : 'darkGray';
                  display.draw(
                    x - topLeftX,
                    y - topLeftY,
                    tile.getChar(),
                    foreground,
                    tile.getBackground()
                  );
                }
            }
        }
        // Render the entities
        var entities = this._map.getEntities();
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            // Only render the entitiy if they would show up on the screen
            if (entity.getX() >= topLeftX && entity.getY() >= topLeftY &&
                entity.getX() < topLeftX + screenWidth &&
                entity.getY() < topLeftY + screenHeight &&
                entity.getZ() == this._player.getZ()) {
                  if (visibleCells[entity.getX() + ',' + entity.getY()]) {
                    display.draw(
                        entity.getX() - topLeftX,
                        entity.getY() - topLeftY,
                        entity.getChar(),
                        entity.getForeground(),
                        entity.getBackground()
                    );
                  }
            }
        }
        // Get the messages in the player's queue and render them
        var messages = this._player.getMessages();
        var messageY = 0;
        for (var i = 0; i < messages.length; i++) {
            // Draw each message, adding the number of lines
            messageY += display.drawText(
                0,
                messageY,
                '%c{white}%b{black}' + messages[i]
            );
        }
        // Render player HP
        var stats = '%c{white}%b{black}';
        stats += vsprintf('HP: %d/%d ', [this._player.getHp(), this._player.getMaxHp()]);
        display.drawText(0, screenHeight, stats);
     },
     handleInput: function(inputType, inputData) {
       if (inputType === 'keydown') {
          // If enter is pressed, go to the win screen
          // If escape is pressed, go to lose screen
          if (inputData.keyCode === ROT.VK_RETURN) {
              Game.switchScreen(Game.Screen.winScreen);
          } else if (inputData.keyCode === ROT.VK_ESCAPE) {
              Game.switchScreen(Game.Screen.loseScreen);
          } else {
              // Movement
              if (inputData.keyCode === ROT.VK_LEFT) {
                  this.move(-1, 0, 0);
              } else if (inputData.keyCode === ROT.VK_RIGHT) {
                  this.move(1, 0, 0);
              } else if (inputData.keyCode === ROT.VK_UP) {
                  this.move(0, -1, 0);
              } else if (inputData.keyCode === ROT.VK_DOWN) {
                  this.move(0, 1, 0);
              } else {
                  // Not a valid key
                  return;
              }
              // Unlock the engine
              this._map.getEngine().unlock();
          }
      } else if (inputType === 'keypress') {
          var keyChar = String.fromCharCode(inputData.charCode);
          if (keyChar === '>') {
              this.move(0, 0, 1);
          } else if (keyChar === '<') {
              this.move(0, 0, -1);
          } else {
              // Not a valid key
              return;
          }
          // Unlock the engine
          this._map.getEngine().unlock();
      }
     },
     move: function(dX, dY, dZ) {
       var newX = this._player.getX() + dX;
        var newY = this._player.getY() + dY;
        var newZ = this._player.getZ() + dZ;
        // Try to move to the new cell
        this._player.tryMove(newX, newY, newZ, this._map);
    }
 }

 // Define our winning screen
 Game.Screen.winScreen = {
     enter: function() {    console.log("Entered win screen."); },
     exit: function() { console.log("Exited win screen."); },
     render: function(display) {
         // Render our prompt to the screen
         for (var i = 0; i < 22; i++) {
             // Generate random background colors
             var r = Math.round(Math.random() * 255);
             var g = Math.round(Math.random() * 255);
             var b = Math.round(Math.random() * 255);
             var background = ROT.Color.toRGB([r, g, b]);
             display.drawText(2, i + 1, "%b{" + background + "}You win!");
         }
     },
     handleInput: function(inputType, inputData) {
         // Nothing to do here
     }
 }

 // Define our winning screen
 Game.Screen.loseScreen = {
     enter: function() {    console.log("Entered lose screen."); },
     exit: function() { console.log("Exited lose screen."); },
     render: function(display) {
         // Render our prompt to the screen
         for (var i = 0; i < 22; i++) {
             display.drawText(2, i + 1, "%b{red}You lose! :(");
         }
     },
     handleInput: function(inputType, inputData) {
         // Nothing to do here
     }
 }