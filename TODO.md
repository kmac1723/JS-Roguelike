Complete tutorial series up to last entry. ---- DONE
  Once done, assess state of project for further improvements and game mechanics.
   - Follow Trystan's Tutorial to add other generic roguelike functions
   - Allow the use of tilesets/sprite engines for Display, rather than only using rot.js.
   - Saved games
   - Reset game from win, lose, or quit screen.

Tidy code:
  Find a better way to include scripts rather than list of script tags in HTML file.
      Non-trivial in Javascript, possibly why this project was abandoned!  It can be done in EJS however...
------This isn't possible although you can use EJS serverside to enclose all Game scripts into
      one EJS template for inclusion on other templates that require it.

Embed game into webpage:
  Use DOM manipulation to display elements of game.
  Expose canvas element created by ROT.Display?
  Pull output values from game to apply them to external elements.

  Saving files:
    Could be done to database serverside easily, but would require maintenance
    Clientside savefile could be tough to do with pure JS.  Use Filesaver.js
    Blob.js to ensure compatibilty, as Blob not natievly supported on all browsers.
