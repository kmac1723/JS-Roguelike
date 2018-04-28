/**
 * @Author: Keith Macpherson
 * @Date:   2018-04-27T16:23:55+01:00
 * @Last modified by:   Keith Macpherson
 * @Last modified time: 2018-04-28T11:25:40+01:00
 */

 
 Game.Entity = function(properties) {
   properties = properties || {};
    // Call the glyph's construtor with our set of properties
    Game.Glyph.call(this, properties);
    // Instantiate any properties from the passed object
    this._name = properties['name'] || '';
    this._x = properties['x'] || 0;
    this._y = properties['y'] || 0;
    this._z = properties['z'] || 0;
    this._map = null;
    // Create an object which will keep track what mixins we have
    // attached to this entity based on the name property
    this._attachedMixins = {};
    // Create a similar object for groups
    this._attachedMixinGroups = {};
    // Setup the object's mixins
    var mixins = properties['mixins'] || [];
    for (var i = 0; i < mixins.length; i++) {
        // Copy over all properties from each mixin as long
        // as it's not the name or the init property. We
        // also make sure not to override a property that
        // already exists on the entity.
        for (var key in mixins[i]) {
            if (key != 'init' && key != 'name' && !this.hasOwnProperty(key)) {
                this[key] = mixins[i][key];
            }
        }
        // Add the name of this mixin to our attached mixins
        this._attachedMixins[mixins[i].name] = true;
        // If a group name is present, add it
        if (mixins[i].groupName) {
            this._attachedMixinGroups[mixins[i].groupName] = true;
        }
        // Finally call the init function if there is one
        if (mixins[i].init) {
            mixins[i].init.call(this, properties);
        }
    }
 }
 // Make entities inherit all the functionality from glyphs
 Game.Entity.extend(Game.Glyph);

 Game.Entity.prototype.hasMixin = function(obj) {
   // Allow passing the mixin itself or the name / group name as a string
   if (typeof obj === 'object') {
       return this._attachedMixins[obj.name];
   } else {
       return this._attachedMixins[obj] || this._attachedMixinGroups[obj];
   }
}

// Getter/Setter methods
Game.Entity.prototype.setPosition = function(x, y, z) {
    this._x = x;
    this._y = y;
    this._z = z;
}
 Game.Entity.prototype.setName = function(name) {
     this._name = name;
 }
 Game.Entity.prototype.setX = function(x) {
     this._x = x;
 }
 Game.Entity.prototype.setY = function(y) {
     this._y = y;
 }
 Game.Entity.prototype.setZ = function(z) {
    this._z = z;
}
 Game.Entity.prototype.getName = function() {
     return this._name;
 }
 Game.Entity.prototype.getX = function() {
     return this._x;
 }
 Game.Entity.prototype.getY   = function() {
     return this._y;
 }
 Game.Entity.prototype.getZ = function() {
    return this._z;
}

 Game.Entity.prototype.setMap = function(map) {
    this._map = map;
}
Game.Entity.prototype.getMap = function() {
    return this._map;
}