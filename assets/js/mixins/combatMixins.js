/**
 * @Author: Keith Macpherson
 * @Date:   2018-05-13T21:32:52+01:00
 * @Last modified by:   Keith Macpherson
 * @Last modified time: 2018-05-26T08:32:06+01:00
 */

// Mixins related to combat (attacking, taking damage etc.)

// Makes an entity attackable and destroyable

 Game.EntityMixins.Destructible = {
    name: 'Destructible',
    init: function(template) {
      this._maxHp = template['maxHp'] || 10;
      // We allow taking in health from the template incase we want
      // the entity to start with a different amount of HP than the
      // max specified.
      this._hp = template['hp'] || this._maxHp;
      this._defenseValue = template['defenseValue'] || 0;
    },
    getHp: function() {
        return this._hp;
    },
    getMaxHp: function() {
        return this._maxHp;
    },
    getDefenseValue: function() {
        var modifier = 0;
        // If we can equip items, then have to take into
        // consideration weapon and armor
        if (this.hasMixin(Game.EntityMixins.Equipper)) {
            if (this.getWeapon()) {
                modifier += this.getWeapon().getDefenseValue();
            }
            if (this.getArmor()) {
                modifier += this.getArmor().getDefenseValue();
            }
        }
        return this._defenseValue + modifier;
    },
    takeDamage: function(attacker, damage) {
        this._hp -= damage;
        // If have 0 or less HP, then remove ourseles from the map
        if (this._hp <= 0) {
            Game.sendMessage(attacker, 'You kill the %s!', [this.getName()]);
            // Raise events
            this.raiseEvent('onDeath', attacker);
            attacker.raiseEvent('onKill', this);
            this.kill();
        }
    },
    setHp: function(hp) {
        this._hp = hp;
    },
    increaseDefenseValue: function(value) {
        // If no value was passed, default to 2.
        value = value || 2;
        // Add to the defense value.
        this._defenseValue += value;
        Game.sendMessage(this, "You look tougher!");
    },
    increaseMaxHp: function(value) {
        // If no value was passed, default to 10.
        value = value || 10;
        // Add to both max HP and HP.
        this._maxHp += value;
        this._hp += value;
        Game.sendMessage(this, "You look healthier!");
    },
    listeners: {
        onGainLevel: function() {
            // Heal the entity.
            this.setHp(this.getMaxHp());
        },
        details: function() {
            return [
                {key: 'defense', value: this.getDefenseValue()},
                {key: 'hp', value: this.getHp()}
            ];
        }
    }
}

Game.EntityMixins.Attacker = {
    name: 'Attacker',
    groupName: 'Attacker',
    init: function(template) {
        this._attackValue = template['attackValue'] || 1;
    },
    getAttackValue: function() {
        var modifier = 0;
        // If we can equip items, then have to take into
        // consideration weapon and armor
        if (this.hasMixin(Game.EntityMixins.Equipper)) {
            if (this.getWeapon()) {
                modifier += this.getWeapon().getAttackValue();
            }
            if (this.getArmor()) {
                modifier += this.getArmor().getAttackValue();
            }
        }
        return this._attackValue + modifier;
    },
    increaseAttackValue: function(value) {
        // If no value was passed, default to 2.
        value = value || 2;
        // Add to the attack value.
        this._attackValue += value;
        Game.sendMessage(this, "You look stronger!");
    },
    attack: function(target) {
      // If the target is destructible, calculate the damage
      // based on attack and defense value
        if (target.hasMixin('Destructible')) {
          var attack = this.getAttackValue();
          var defense = target.getDefenseValue();
          var max = Math.max(0, attack - defense);
          var damage = 1 + Math.floor(Math.random() * max);
          Game.sendMessage(this, 'You strike the %s for %d damage!',
              [target.getName(), damage]);
          Game.sendMessage(target, 'The %s strikes you for %d damage!',
              [this.getName(), damage]);
          target.takeDamage(this, damage);
        }
    },
    listeners: {
        details: function() {
            return [{key: 'attack', value: this.getAttackValue()}];
        }
    }
}

Game.EntityMixins.Thrower = {
    name: 'Thrower',
    init: function(template){

    },
    // Throw item
    throw: function(targetX, targetY, targetZ, itemKey){
          //Add item to the target location
          this._map.addItem(targetX, targetY, targetZ, this._items[itemKey]);
          // unequip if necessary
          if(this.hasMixin('Equipper')){
            this.unequip(this._items[itemKey]);
          }
          // Get entity at location
          var hitEntity = this._map.getEntityAt(targetX, targetY, targetZ);
          // if there is one, and it can take damage, apply damage to that entity.
          if(hitEntity && hitEntity.hasMixin('Destructible')){

              var damage = this._items[itemKey].getThrownAttackValue();

              // console.log(this);
              // BUG: sendMessage not working, but console.log is outputting correct string
              // Sending to the worng object?  What is this? the player object
              var attackString = "You strike the " + hitEntity.getName() + " for " + damage + " damage!";
              // Game.sendMessage(this, 'You strike the %s for %d damage!',
              //     [hitEntity.getName(), damage]);
              Game.sendMessage(this, attackString);
              hitEntity.takeDamage(this, damage);
          }
          // remove from inventory
          if(this.hasMixin('InventoryHolder')){
              this.removeItem(itemKey);
          }
    }
}
