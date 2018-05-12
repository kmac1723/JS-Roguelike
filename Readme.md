Tutorial for rot.js library

A Javascript Roguelike game, built using the rot.js library by Ondrej Zara,
and based on the tutorial series by Dominic Charley-Roy.  Uses the sprintf.js
library by Alexandru Marasteanu for the messaging system.

All required packages (rot.js, sprintf.js) are bundled in the /lib/ directory.

TO PLAY THE GAME:
  Open up main.html in a browser.  There should be a game window with the Javascript
    Roguelike game in it.

    SYMBOLS:
    @ : player character (you!)
    # : Wall
    . : Floor
    < , > : Stairways to next/previous level.
    * , % : Items (rock, apple)
    F , : , B, k : Enemies

    Other items available, such as weapons and armour.

    CONTROLS:
    - Arrow keys to move.
    - Hit < or > to move up or down a level while on a stairway.
    - i to open inventory.
    - , key to pick up items.
    - d to drop items.
    - e to eat an edible item.
    - w to wield an equipable item.
    - SHIFT + w to wear a wearable item.
    - Press Enter to activate the win screen.
    - Press Escape to activate the lose screen.

    GAMEPLAY "FEATURES":
    - Walls can be tunnelled through by moving into them.
    - Enemies can be attacked by attempting to move into the tile that they occupy.  
    - Enemies except the Fungus (F) can attack the player in a similar way,
        and if the player reaches 0hp, the game is over.
    - When entering a gameover state (e.g. death), the page requires refreshing
        to restart the game.
    - Hunger system, with current hunger state displayed in the bottem left of the
        screen.  Eat regularly to avoid death.
    - Gain experience by killing enemies, and level up you stats!  Enemies also
        get tougher and stronger the further down you go.
    - Boss level!

NOTE REGARDING TUTORIAL:
  The last update to the series was on November 25, 2013, and apparently has not been
  updated since.  
    The last entry mentions introducing throwing/ranged weapon attacks,
  and refactoring the code to redistribute the entity mixins into separate scripts,
  grouping mixins into packets of related functionality.  So a combat.js script
  would contain all the mixins related to applying damage, while a moves.js script
  contains all mixins that alters an entity's position on the map.
    This could be a good place to start when looking to progress with the project.

CURRENT STATE:
  A title screen, play screen, and win and lose game over screens.
  Procedurally generates a multi-level cave system.
  A Player character that moves and attacks, and can travel between levels and dig
    through walls.
  Enemies that randomly move and attack the player, and a fungus that clones itself.
  Only renders tiles and entities within player radius of sight, and renders previously
    explored tiles in gray.
  Messaging system that displays player health and combat messages.
  Items that can be picked up and dropped using an inventory system.

POSSIBLE IMPROVEMENTS:
  Add reset functionality to game over screens.
  Visible tiles are checked and stored in a hashmap.  There are faster methods to do this.
  Refactor display elements to handle screen resizing and different devices.  Also expose
    game parameters and messages to other html elements for finer GUI formatting.

BUGS:
- kobold pathfinding not working?
- when digging, tile SE of player entity becomes exploreed and is highlighted as visible,
    but other corner tiles are not.


Tutorial series: http://www.codingcookies.com/2013/04/01/building-a-roguelike-in-javascript-part-1/
Content © 2014 Dominic Charley-Roy

rot.js on Github: https://github.com/ondras/rot.js
rot.js is (C) 2012-2018 Ondrej Zara

Alexandru Marasteanu on Github: https://github.com/alexei
sprintf library on Github: https://github.com/alexei/sprintf.js

Useful series of articles on roguelike development: http://www.roguebasin.com/index.php?title=Articles
