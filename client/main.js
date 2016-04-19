Meteor.subscribe('menulist');
Meteor.subscribe('events');
Meteor.subscribe('orders');
Meteor.subscribe('images');

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});

Errors = new Meteor.Collection(null);



Template.header.helpers({
	creator: function(){
		return !! Roles.getGroupsForUser(Meteor.userId(), 'creator')[0];
	}
});