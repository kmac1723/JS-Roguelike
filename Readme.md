Tutorial for rot.js library

A Javascript Roguelike game, built using the rot.js library by Ondrej Zara,
and based on the tutorial series by Dominic Charley-Roy.  Uses the sprintf.js
library by Alexandru Marasteanu for the messaging system.

All required packages (rot.js, sprintf.js) are bundled in the /lib/ directory.

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
  Generates a multi-level cave system
  Player character that moves and attacks, and can travel between levels.
  Fungus that clones itself
  Only renders tiles within player radius of sight, and previously explored.
  Messaging system that displays player health and combat messages.

POSSIBLE IMPROVEMENTS:
  Visible tiles are checked and stored in a hashmap.  There are faster methods to do this.


Tutorial series: http://www.codingcookies.com/2013/04/01/building-a-roguelike-in-javascript-part-1/
Content © 2014 Dominic Charley-Roy

rot.js on Github: https://github.com/ondras/rot.js
rot.js is (C) 2012-2018 Ondrej Zara

Alexandru Marasteanu on Github: https://github.com/alexei
sprintf library on Github: https://github.com/alexei/sprintf.js

Series of articles on roguelike development: http://www.roguebasin.com/index.php?title=Articles
