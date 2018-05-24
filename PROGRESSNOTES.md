Notes for current code additions

Throwing items.
==============

Active Files:
  itemListScreen.js, examineScreen.js, combatMixins.js

Current Progress:
================
Can open Screens for selecting throwable items and targeting a location.
Can add the thrown item to the targeted tile, and then remove it from inventory.
Can do something to an entity occupying the targeted tile (currently bugged).


TODO
====

Fix bug where an entity hit by a thrown item has their hp set to Nan.

Prevent player throwing item onto their own tile, damaging themselves.
  (currently also bugs the player hp)
