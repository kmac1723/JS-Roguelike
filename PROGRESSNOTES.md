Notes for current code additions

Throwing items.
==============

Active Files:
  itemListScreen.js, examineScreen.js, combatMixins.js

Current Progress:
================
Can open Screens for selecting throwable items and targeting a location.
Can add the thrown item to the targeted tile, and then remove it from inventory.
Can apply damage to an entity occupying the targeted tile.


TODO
====

Prevent player throwing item onto their own tile, damaging themselves?
  (leave in for hilarity?)

  Ensure messages are sent properly (e.g. "You strike the" entity "with a rock
      for " damage)

  Message not appearing?  But console.log outputs the correct string...
  Verified that the Game.message function is sending to the player object

  Going from target sub screen to play screen, which might be re-rendering the screen
    So message is being rendered, but then immediately overwritten by the next render cycle?

  May need a message buffer attached to examine screens?
  Better solution, don't erase messages on next turn?  Temp solution, need to
    make message system more robust (logging, etc.).
  Easy way: have a counting variable in MessageRecipient that clears messages when at zero?

  Try adding message to the targetScreen function, rather than the throw function...?
