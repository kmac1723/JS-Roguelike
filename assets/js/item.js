/**
 * @Author: Keith Macpherson
 * @Date:   2018-04-29T12:43:02+01:00
 * @Last modified by:   Keith Macpherson
 * @Last modified time: 2018-05-01T19:58:15+01:00
 */

// Base class for items.

// NOTE: Refactored to inherit from DynamicGlyph class.
 Game.Item = function(properties) {
     properties = properties || {};
     // Call the glyph's construtor with our set of properties
     Game.DynamicGlyph.call(this, properties);

 };
 // Make items inherit all the functionality from glyphs
 Game.Item.extend(Game.DynamicGlyph);
