- Digging into caves markes bottom-right tile as explored.
- in examineScreen function, when hitting Enter, Error: okFunction has not been defined...
- It is possible to descend a level onto a tile occupied by an enemy entity, which
    causes weird behaviour with pathfinding and attacking functions.

- Thrown items set the hit entity's health value to NaN, making them immortal.

- Inconsistent ways of accessing items in different inventory/ equipper functions
  e.g. access by array key, item itself etc.
