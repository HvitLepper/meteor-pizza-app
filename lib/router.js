 Router.configure ({
	layoutTemplate: 'layout'
});

Router.map(function(){
	this.route('chooseMenu', {
		path: '/menulist',
		waitOn: function(){return Meteor.subscribe('menulist');},
		data: function(){return MenuList.find();}
		});
	this.route('editItem', {
		path: '/menulist/edit-item/:_id',
		data: function() {return MenuList.findOne(this.params._id);}
		});
	this.route('createGroup', {
		path: '/create-group',
		data: function(){return Meteor.users.find();}
	});
	this.route('editGroup', {
		path: '/edit-group',
		waitOn: function(){return Meteor.subscribe('usersList');},
		data: function(){return Meteor.users.find();}
	});
	this.route('showEvents', {
		path: '/',
		waitOn: function(){return Meteor.subscribe('events');},
		data: function(){return Events.find();}
	});
	var requireLogin = function() {
  		if (! Meteor.user()) {
    		this.render('welcome');
  			} else {
    			this.next();
  			}
		};
	var requireGroup = function() {
  		var group = Roles.getGroupsForUser(Meteor.userId())[0];
		if(!Roles.userIsInRole(Meteor.userId(), 'creator', group)){
    		this.render('accessDenied');
  			} else {
    			this.next();
  			}
		};

	Router.onBeforeAction(requireLogin, {only: 'showEvents'});
	Router.onBeforeAction(requireGroup, {only: 'editGroup'});
});  

