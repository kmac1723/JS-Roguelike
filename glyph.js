/**
 * @Author: Keith Macpherson
 * @Date:   2018-04-27T14:28:08+01:00
 * @Last modified by:   Keith Macpherson
 * @Last modified time: 2018-04-27T16:20:57+01:00
 */
 Game.Glyph = function(properties) {
     // Instantiate properties to default if they weren't passed
     properties = properties || {};
     this._char = properties['character'] || ' ';
     this._foreground = properties['foreground'] || 'white';
     this._background = properties['background'] || 'black';
 };

 // Create standard getters for glyphs
 Game.Glyph.prototype.getChar = function(){
     return this._char;
 }
 Game.Glyph.prototype.getBackground = function(){
     return this._background;
 }
 Game.Glyph.prototype.getForeground = function(){
     return this._foreground;
 }
