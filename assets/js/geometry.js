/**
 * @Author: Keith Macpherson
 * @Date:   2018-05-12T13:08:45+01:00
 * @Last modified by:   Keith Macpherson
 * @Last modified time: 2018-05-12T13:10:52+01:00
 */

// Geometry utilities class, for drawing shapes onto the game canvas elemtn.
// TODO: replace with a more generalised vreion that can be integrated with
//      other sprite engines?  eg. pixi.js, and vector graphics libs eg. papaer.js 
 Game.Geometry = {
     getLine: function(startX, startY, endX, endY) {
         var points = [];
         var dx = Math.abs(endX - startX);
         var dy = Math.abs(endY - startY);
         var sx = (startX < endX) ? 1 : -1;
         var sy = (startY < endY) ? 1 : -1;
         var err = dx - dy;
         var e2;

         while (true) {
             points.push({x: startX, y: startY});
             if (startX == endX && startY == endY) {
                 break;
             }
             e2 = err * 2;
             if (e2 > -dx) {
                 err -= dy;
                 startX += sx;
             }
             if (e2 < dx){
                 err += dx;
                 startY += sy;
             }
         }

         return points;
     }
 };
