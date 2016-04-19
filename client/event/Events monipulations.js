Template.header.events({
	'click #new-group': function(){
		Router.go('createGroup');
	},
	'click #add-user': function(){
		Modal.show('selectGroup');
		Session.set('Button', 'group');
	},
	'click #temp': function(){
		Router.go('showEvents');
	},
	'click #new-event': function(){
		Session.set('Button', 'event');
		Modal.show('selectGroup');
	}
});

Template.showEvents.helpers({
	events: function(){
		return Events.find({});
	},
	checkGroup: function(){
		if (Roles.userIsInRole(Meteor.userId(), 'user', this.group))
			{
				return true;
			}
		return false;
	},
	NotTakePart: function(){
		return !(_.include(this.votered, Meteor.userId()));
	},
	logo: function(){
		return Images.find();
	}
});

Template.showEvents.events({
	'click .attent': function(){
		Session.set('CurrentGroup', this.group);
		Session.set('CurrentEvent', this._id);
		Router.go('chooseMenu');
	},
	'click .state': function(){
		var groups = Roles.getGroupsForUser(Meteor.userId(), 'creator');
		if (_.include(groups, this.group)){
			if(this.state=='ordering'){
				Events.update(this._id, {$set: {state: 'ordered'}});
			}
			if(this.state=='ordered'){
				Events.update(this._id, {$set: {state: 'delivering'}});
			}
			if(this.state==='delivering'){
				Events.update(this._id, {$set: {state: 'delivered'}});
			}
			if(this.state==='delivered'){
				Events.remove(this._id);
			}
		}

	},
	'click .cancel': function(){
		Events.update(this._id, {$addToSet: {votered: Meteor.userId()}});
	}
});

Tracker.autorun(function(){
	var eventCursor = Events.find();
	eventCursor.forEach(function(ev){
		Meteor.call('CountOrders', ev._id, ev.group);
	});
	var menuCursor = MenuList.find();
	menuCursor.forEach(function(item){
		if(item.coupCount==0){
			MenuList.update(item._id, {$set: {coupon: ''}});
		}
		if(item.coupCount==1){
			MenuList.update(item._id, {$set: {coupon: 'free'}});
		}
	});
});