//this file should only be included when developing and not in production
var originalBackboneTrigger = Backbone.Events.trigger;
Backbone.Events.trigger = function() {
	console.log(arguments, "Event Triggered");
	originalBackboneTrigger.apply(this, arguments);
};