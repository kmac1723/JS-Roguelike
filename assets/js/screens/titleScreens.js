/**
 * @Author: Keith Macpherson
 * @Date:   2018-05-13T14:13:17+01:00
 * @Last modified by:   Keith Macpherson
 * @Last modified time: 2018-05-13T14:15:01+01:00
 */

// Contains the title, win, and lose screens

// ==========================================================
  // Title screen.
  Game.Screen.startScreen = {
      enter: function() { console.log("Entered start screen."); },
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
  };

 // =============================================================
  // Define our winning screen
  Game.Screen.winScreen = {
      enter: function() { console.log("Entered win screen."); },
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
          // TODO: Handle an input to reset the game state.
      }
  };

 // ========================================
  // Define our losing screen
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
          // TODO: handle input to allow for reset of game state.
      }
  };
