/**
 * @Author: Keith Macpherson
 * @Date:   2018-04-29T12:43:02+01:00
 * @Last modified by:   Keith Macpherson
 * @Last modified time: 2018-04-29T13:06:27+01:00
 */

// Base class for items.

 Game.Item = function(properties) {
     properties = properties || {};
     // Call the glyph's construtor with our set of properties
     Game.Glyph.call(this, properties);
     // Instantiate any properties from the passed object
     this._name = properties['name'] || '';
 };
 // Make items inherit all the functionality from glyphs
 Game.Item.extend(Game.Glyph);
