Complete tutorial series up to last entry. ---- DONE
  Once done, assess state of project for further improvements and game mechanics.
  For example, add the ability to reset the gamestate to the winning and losing screens.
  Also, saving game needs to be implemented
Remove bug(?) where the player has to click on the window before the game will
  accept keyboard inputs.
Tidy code:
  Find a better way to include scripts rather than list of script tags in HTML file.
      Non-trivial in Javascript, possibly why this project was abandoned!  It can be done in EJS however...
  Seperate entitymixins.js into scripts that group related mixins (e.g. combat, experience).
  Update comments to reflect state of code.
  Check all formatting and indentation.
Embed game into webpage:
  Use DOM manipulation to display elements of game.
  Expose canvas element created by ROT.Display?
  Pull output values from game to apply them to external elements.

  Saving files:
    Could be done to database serverside easily, but would require maintenance
    Clientside savefile could be tough to do with pure JS.  Use Filesaver.js
    Blob.js to ensure compatibilty, as Blob not natievly supported on all browsers.
