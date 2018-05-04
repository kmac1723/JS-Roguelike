/**
 * @Author: Keith Macpherson
 * @Date:   2018-04-29T12:52:08+01:00
 * @Last modified by:   Keith Macpherson
 * @Last modified time: 2018-05-01T20:46:11+01:00
 */
/*
A repository of templates that allows for the reation of new object based on
  existing templates.
*/
 // A repository has a name and a constructor. The constructor is used to create
 // items in the repository.
 Game.Repository = function(name, ctor) {
     this._name = name;
     this._templates = {};
     this._randomTemplates = {};
     this._ctor = ctor;
 };

 // Define a new named template.
 // NOTE: now includes random templates!
 Game.Repository.prototype.define = function(name, template, options) {
     this._templates[name] = template;
    // Apply any options
    var disableRandomCreation = options && options['disableRandomCreation'];
    if (!disableRandomCreation) {
        this._randomTemplates[name] = template;
    }
 };


 // Create an object based on a template.
 Game.Repository.prototype.create = function(name, extraProperties) {
     if (!this._templates[name]) {
        throw new Error("No template named '" + name + "' in repository '" +
            this._name + "'");
    }
    // Copy the template
    var template = Object.create(this._templates[name]);
    // Apply any extra properties
    if (extraProperties) {
        for (var key in extraProperties) {
            template[key] = extraProperties[key];
        }
    }
    // Create the object, passing the template as an argument
    return new this._ctor(template);
 };

 // Create an object based on a random template
 Game.Repository.prototype.createRandom = function() {
     // Pick a random key and create an object based off of it.
     return this.create(Object.keys(this._randomTemplates).random());
 };
