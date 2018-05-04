- Kobold actor does not hunt the Player ######FIXED#######
    Hunt task in the TaskActor entity mixin is not being called
    isVisible parameter in candotask function in taskactor mixin is never true.
    seePlayer is never true.
    in map.js, this._player was never defined.
