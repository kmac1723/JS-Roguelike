/**
 * @Author: Keith Macpherson
 * @Date:   2018-04-27T13:11:49+01:00
 * @Last modified by:   Keith Macpherson
 * @Last modified time: 2018-04-28T11:27:39+01:00
 */

 // rot.js tutorial program

 // TODO: Make game react to button presses without having to click on the window
 // TODO: Properly organise and document all scripts, to ensure understanding.
 

 var Game =  {
    _display: null,
    _currentScreen: null,
    _screenWidth: 80,
    _screenHeight: 24,

    init: function() {
        // Any necessary initialization will go here.
        this._display = new ROT.Display({width: this._screenWidth, height: this._screenHeight + 1});

        var game = this; // So that we don't lose this
        var bindEventToScreen = function(event) {
            window.addEventListener(event, function(e) {
                // When an event is received, send it to the
                // screen if there is one
                if (game._currentScreen !== null) {
                    // Send the event type and data to the screen
                    game._currentScreen.handleInput(event, e);
                }
            });
        }
        // Bind keyboard input events
        bindEventToScreen('keydown');
        //bindEventToScreen('keyup');
        bindEventToScreen('keypress');
    },

    getDisplay: function() {
        return this._display;
    },
    getScreenWidth: function() {
        return this._screenWidth;
    },
    getScreenHeight: function() {
        return this._screenHeight;
    },

    switchScreen: function(screen) {
      // If we had a screen before, notify it that we exited
      if (this._currentScreen !== null) {
          this._currentScreen.exit();
      }
      // Clear the display
      this.getDisplay().clear();
      // Update our current screen, notify it we entered
      // and then render it
      this._currentScreen = screen;
      if (!this._currentScreen !== null) {
          this._currentScreen.enter();
          this.refresh();
      }
    },
    refresh: function() {
        // Clear the screen
        this._display.clear();
        // Render the screen
        this._currentScreen.render(this._display);
    },
}

window.onload = function(){
  if (!ROT.isSupported()) {
      alert("The rot.js library isn't supported by your browser.");
  } else {
    Game.init();
    // Add the container to our HTML page
    document.body.appendChild(Game.getDisplay().getContainer());

    // Set focus to the ROT.display element?
    // Game.getDisplay().getContainer().focus();
    // document.querySelector('canvas').focus();
    // this.focus();

    // Load the start screen
    Game.switchScreen(Game.Screen.startScreen);
  }
}
