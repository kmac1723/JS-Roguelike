   - Follow Trystan's Tutorial to add other generic roguelike functions
   - Allow the use of tilesets/sprite engines for Display, rather than only using rot.js.
   - Saved games
   - Reset game from win, lose, or quit screen.

Tidy code:
  Refactor code into seperate files that collect mixins/classes/screens by related
  functionality.
    e.g. combat, displaying items,

Embed game into webpage:
  Use DOM manipulation to display elements of game.
  Expose canvas element created by ROT.Display?
  Pull output values from game to apply them to external elements.
  Could also explore using other JS libraries to display game e.g. pixi.js, and  
    use sprites and animations to allow the game to look pretty.

  Saving files:
    Could be done to database serverside easily, but would require maintenance
    Clientside savefile could be tough to do with pure JS.  Use Filesaver.js
    Blob.js to ensure compatibilty, as Blob not natievly supported on all browsers.

Inventory System
- Edit inventory/equipper functions to ensure that accessing inventory items is
    done consistently (i.e. either by array key or item)
- Allow "stacking" of items (i.e. so multiple copies of certain items sit in the
    same inventory slot, based on a maxStackSize on the item class)
    -e.g. rock maxStackSize = 16, so the player can hold 16 rocks in one slot,
      but can put other stacks of rocks in other slots.

Message System
  - Have a message log rather than one off messages that dissappear the next turn.
    -limited size, like 10 lines or something...
