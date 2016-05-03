Template.editGroup.helpers({
	users: function() {
		return Meteor.users.find();
	},
	usersInGroup: function() {
		return Roles.getUsersInRole('user', currentGroup.get());
	}
});

Template.editGroup.events({
	'submit form': function(e) {
		e.preventDefault();
		
		var user = e.target.addWho.value;
		var id = Meteor.users.findOne({username: user})._id;

		Meteor.call('setUserRole', id, currentGroup.get(), function (error) {
			if (error) {
			   throwError("Can't add role to user");
			}
 		 });
	},
	'click .remove': function(){
		var user = this._id;

		Meteor.call('removeUserFromRole', user, currentGroup.get(), function (error) {
			if (error) {
			   throwError("Can't remove role from user");
			}
 		 });
	},
	'click #cancel': function() {
		Router.go('showEvents');
	}
});