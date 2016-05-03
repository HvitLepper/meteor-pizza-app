Template.errors.onCreated(function() {
  lastError = new ReactiveVar(null);
});

throwError = function (errMessage) {
	lastError.set(errMessage);
}

Template.errors.helpers({
  error: function() {
  	return lastError.get();
  }
});

Template.errors.events({
	'click .close': function() {
		lastError.set(null);
	}
});