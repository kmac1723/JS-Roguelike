/**
 * @Author: Keith Macpherson
 * @Date:   2018-04-27T14:29:29+01:00
 * @Last modified by:   Keith Macpherson
 * @Last modified time: 2018-04-28T20:13:20+01:00
 */

 // Has been refactored to change Game.Tile.isWalkable to ..._walkable
 // Therefore need to alter the getter functions to refelet this?
 Game.Tile = function(properties) {
     properties = properties || {};
     // Call the Glyph constructor with our properties
     Game.Glyph.call(this, properties);
     // Set up the properties. We use false by default.
     this._walkable = properties['walkable'] || false;
     this._diggable = properties['diggable'] || false;
     this._blocksLight = (properties['blocksLight'] !== undefined) ?
        properties['blocksLight'] : true;
 };
 // Make tiles inherit all the functionality from glyphs
Game.Tile.extend(Game.Glyph);

// Standard getters
Game.Tile.prototype.isWalkable = function() {
    return this._walkable;
}
Game.Tile.prototype.isDiggable = function() {
    return this._diggable;
}
Game.Tile.prototype.isBlockingLight = function() {
    return this._blocksLight;
}

// Tile Definitions
Game.Tile.nullTile = new Game.Tile({})
Game.Tile.floorTile = new Game.Tile({
    character: '.',
    walkable: true,
    blocksLight: false
});
Game.Tile.wallTile = new Game.Tile({
    character: '#',
    foreground: 'goldenrod',
    diggable: true,
    // blocksLight: true
});
Game.Tile.stairsUpTile = new Game.Tile({
    character: '<',
    foreground: 'white',
    walkable: true,
    blocksLight: false
});
Game.Tile.stairsDownTile = new Game.Tile({
    character: '>',
    foreground: 'white',
    walkable: true,
    blocksLight: false
});

// helper function
Game.getNeighborPositions = function(x, y) {
    var tiles = [];
    // Generate all possible offsets
    for (var dX = -1; dX < 2; dX ++) {
        for (var dY = -1; dY < 2; dY++) {
            // Make sure it isn't the same tile
            if (dX == 0 && dY == 0) {
                continue;
            }
            tiles.push({x: x + dX, y: y + dY});
        }
    }
    return tiles.randomize();
}
