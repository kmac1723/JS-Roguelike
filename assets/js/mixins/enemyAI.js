/**
 * @Author: Keith Macpherson
 * @Date:   2018-05-13T22:05:32+01:00
 * @Last modified by:   Keith Macpherson
 * @Last modified time: 2018-05-13T22:18:28+01:00
 */

// Mixins for enemy AI actions e.g TaskACtor for calcualting standard actions,
//  ZombieBoss actor for boss creature actions.

 // TaskActor mixin defines a list of taks that the entity will attempt sequentially.
 //  The first task that is possible to be done is then exectued that turn.
 // Hunt task uses ROT.Astar pathfinding algorithm.
 // NOTE: available tasks are defined by an array of strings, corresponding to functions
 //          within the TaskActor mixin.  Better way to do this?  All tasks are hard-coded.

  Game.EntityMixins.TaskActor = {
     name: 'TaskActor',
     groupName: 'Actor',
     init: function(template) {
         // Load tasks
         this._tasks = template['tasks'] || ['wander'];
         // console.log(this._tasks); // BUG: task array is created correctly
     },
     act: function() {
         // Iterate through all our tasks
         for (var i = 0; i < this._tasks.length; i++) {
             if (this.canDoTask(this._tasks[i])) {
                 // If we can perform the task, execute the function for it.
                 this[this._tasks[i]]();
                 return;
             }
         }
     },

     canDoTask: function(task) {
         if (task === 'hunt') {
             return this.hasMixin('Sight') && this.canSee(this.getMap().getPlayer());
         } else if (task === 'wander') {
             return true;
         } else {
             throw new Error('Tried to perform undefined task ' + task);
         }
     },
     hunt: function() {
         console.log('Hunting player...'); // BUG: Not calling this function
         var player = this.getMap().getPlayer();

         // If we are adjacent to the player, then attack instead of hunting.
         var offsets = Math.abs(player.getX() - this.getX()) +
             Math.abs(player.getY() - this.getY());
         if (offsets === 1) {
             if (this.hasMixin('Attacker')) {
                 this.attack(player);
                 return;
             }
         }

         // Generate the path and move to the first tile.
         var source = this;
         var z = source.getZ();
         var path = new ROT.Path.AStar(player.getX(), player.getY(), function(x, y) {
             // If an entity is present at the tile, can't move there.
             var entity = source.getMap().getEntityAt(x, y, z);
             if (entity && entity !== player && entity !== source) {
                 return false;
             }
             return source.getMap().getTile(x, y, z).isWalkable();
         }, {topology: 4});
         // Once we've gotten the path, we want to move to the second cell that is
         // passed in the callback (the first is the entity's strting point)
         var count = 0;
         path.compute(source.getX(), source.getY(), function(x, y) {
             if (count == 1) {
                 source.tryMove(x, y, z);
             }
             count++;
         });
     },
     wander: function() {
         // Flip coin to determine if moving by 1 in the positive or negative direction
         var moveOffset = (Math.round(Math.random()) === 1) ? 1 : -1;
         // Flip coin to determine if moving in x direction or y direction
         if (Math.round(Math.random()) === 1) {
             this.tryMove(this.getX() + moveOffset, this.getY(), this.getZ());
         } else {
             this.tryMove(this.getX(), this.getY() + moveOffset, this.getZ());
         }
     }
 };

 Game.EntityMixins.FungusActor = {
     name: 'FungusActor',
     groupName: 'Actor',
     init: function() {
         this._growthsRemaining = 5;
     },
     act: function() {
         // Check if we are going to try growing this turn
         if (this._growthsRemaining > 0) {
             if (Math.random() <= 0.02) {
                 // Generate the coordinates of a random adjacent square by
                 // generating an offset between [-1, 0, 1] for both the x and
                 // y directions. To do this, we generate a number from 0-2 and then
                 // subtract 1.
                 var xOffset = Math.floor(Math.random() * 3) - 1;
                 var yOffset = Math.floor(Math.random() * 3) - 1;
                 // Make sure we aren't trying to spawn on the same tile as us
                 if (xOffset != 0 || yOffset != 0) {
                     // Check if we can actually spawn at that location, and if so
                     // then we grow!
                     if (this.getMap().isEmptyFloor(this.getX() + xOffset,
                                                    this.getY() + yOffset,
                                                    this.getZ())) {
                         var entity = Game.EntityRepository.create('fungus');
                         entity.setPosition(this.getX() + xOffset, this.getY() + yOffset,
                             this.getZ());
                         this.getMap().addEntity(entity);
                         this._growthsRemaining--;
                         // Send a message nearby!
                         Game.sendMessageNearby(this.getMap(),
                             entity.getX(), entity.getY(), entity.getZ(),
                             'The fungus is spreading!');
                     }
                 }
             }
         }
     }
 };

 // Class for zombie boss task actor class
 // NOTE: Maybe this and TaskActor could be refactored into a general purpose task lis

 Game.EntityMixins.GiantZombieActor = Game.extend(Game.EntityMixins.TaskActor, {
     init: function(template) {
         // Call the task actor init with the right tasks.
         Game.EntityMixins.TaskActor.init.call(this, Game.extend(template, {
             'tasks' : ['growArm', 'spawnSlime', 'hunt', 'wander']
         }));
         // We only want to grow the arm once.
         this._hasGrownArm = false;
     },
     canDoTask: function(task) {
         // If we haven't already grown arm and HP <= 20, then we can grow.
         if (task === 'growArm') {
             return this.getHp() <= 20 && !this._hasGrownArm;
         // Spawn a slime only a 10% of turns.
         } else if (task === 'spawnSlime') {
             return Math.round(Math.random() * 100) <= 10;
         // Call parent canDoTask
         } else {
             return Game.EntityMixins.TaskActor.canDoTask.call(this, task);
         }
     },
     growArm: function() {
         this._hasGrownArm = true;
         this.increaseAttackValue(5);
         // Send a message saying the zombie grew an arm.
         Game.sendMessageNearby(this.getMap(),
             this.getX(), this.getY(), this.getZ(),
             'An extra arm appears on the giant zombie!');
     },
     spawnSlime: function() {
         // Generate a random position nearby.
         var xOffset = Math.floor(Math.random() * 3) - 1;
         var yOffset = Math.floor(Math.random() * 3) - 1;

         // Check if we can spawn an entity at that position.
         if (!this.getMap().isEmptyFloor(this.getX() + xOffset, this.getY() + yOffset,
             this.getZ())) {
             // If we cant, do nothing
             return;
         }
         // Create the entity
         var slime = Game.EntityRepository.create('slime');
         slime.setX(this.getX() + xOffset);
         slime.setY(this.getY() + yOffset)
         slime.setZ(this.getZ());
         this.getMap().addEntity(slime);
     },
     listeners: {
         onDeath: function(attacker) {
             // Switch to win screen when killed!
             Game.switchScreen(Game.Screen.winScreen);
         }
     }
 });
