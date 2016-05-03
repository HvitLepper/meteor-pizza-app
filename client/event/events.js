Meteor.subscribe('events');

Template.showEvents.helpers({
    events: function() {
        return Events.find();
    },
    isInGroup: function() {
        if (Roles.userIsInRole(Meteor.userId(), 'user', this.group)) {
            return true;
        }
        return false;
    },
    notVoted: function() {
        return !(_.include(this.voted, Meteor.userId()));
    }
});

currentGroup = new ReactiveVar();
currentEventId = new ReactiveVar();

Template.showEvents.events({
    'click .attend': function() {
        currentGroup.set(this.group);
        currentEventId.set(this._id);

        Router.go('chooseMenu');
    },
    'click .state': function() {
        var groups = Roles.getGroupsForUser(Meteor.userId(), 'creator');
        if (_.include(groups, this.group)) {
            if(this.state === 'ordered'){
                Events.update(this._id, {$set: {state: 'delivering'}});
            }
            if(this.state === 'delivering') {
                Events.update(this._id, {$set: {state: 'delivered'}});
            }
            if(this.state === 'delivered') {
                Events.remove(this._id);
            }
        }
    },
    'click .cancel': function() {
        Events.update(this._id, {$addToSet: {voted: Meteor.userId()}});
    }
});
