/**
 * @Author: Keith Macpherson
 * @Date:   2018-05-10T19:08:59+01:00
 * @Last modified by:   Keith Macpherson
 * @Last modified time: 2018-05-10T19:09:25+01:00
 */

 Game.extend = function(src, dest) {
     // Create a copy of the source.
     var result = {};
     for (var key in src) {
         result[key] = src[key];
     }
     // Copy over all keys from dest
     for (var key in dest) {
         result[key] = dest[key];
     }
     return result;
 };
