/**
 * @Author: Keith Macpherson
 * @Date:   2018-05-13T14:11:23+01:00
 * @Last modified by:   Keith Macpherson
 * @Last modified time: 2018-05-13T14:15:45+01:00
 */

// Contains the help screen, listing command and objectives.

 // ========================================
 // Help screen
 Game.Screen.helpScreen = {
     render: function(display) {
         var text = 'jsrogue help';
         var border = '-------------';
         var y = 0;
         display.drawText(Game.getScreenWidth() / 2 - text.length / 2, y++, text);
         display.drawText(Game.getScreenWidth() / 2 - text.length / 2, y++, border);
         display.drawText(0, y++, 'The villagers have been complaining of a terrible stench coming from the cave.');
         display.drawText(0, y++, 'Find the source of this smell and get rid of it!');
         y += 3;
         display.drawText(0, y++, '[,] to pick up items');
         display.drawText(0, y++, '[d] to drop items');
         display.drawText(0, y++, '[e] to eat items');
         display.drawText(0, y++, '[w] to wield items');
         display.drawText(0, y++, '[W] to wield items');
         display.drawText(0, y++, '[x] to examine items');
         display.drawText(0, y++, '[;] to look around you');
         display.drawText(0, y++, '[?] to show this help screen');
         y += 3;
         text = '--- press any key to continue ---';
         display.drawText(Game.getScreenWidth() / 2 - text.length / 2, y++, text);
     },
     handleInput: function(inputType, inputData) {
         Game.Screen.playScreen.setSubScreen(null);
     }
 };
