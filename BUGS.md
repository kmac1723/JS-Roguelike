- Digging into caves markes bottom-right tile as explored.

- It is possible to descend a level onto a tile occupied by an enemy entity, which
    causes weird behaviour with pathfinding and attacking functions.

- Thrown items set the hit entity's health value to NaN, making them immortal. --FIXED

- Throwing an item is supposed to display a message to the player.  It currently doesn't.

- Inconsistent ways of accessing items in different inventory/ equipper functions
  e.g. access by array key, item itself etc.
