isThisUserCreator = function() {
	return !!Roles.getGroupsForUser(Meteor.userId(), 'creator')[0];
}

Template.header.helpers({
	creator: function() {
		return isThisUserCreator();
	}
});

pressedButtonHeader = new ReactiveVar();

Template.header.events({
    'click #new-group': function() {
        Router.go('createGroup');
    },
    'click #add-user': function() {
    	pressedButtonHeader.set('group');
        Modal.show('selectGroup');        
    },
    'click #temp': function() {
        Router.go('showEvents');
    },
    'click #new-event': function() {
        pressedButtonHeader.set('event');
        Modal.show('selectGroup');
    }
});