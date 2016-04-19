MenuList = new Mongo.Collection("menulist");
Events = new Mongo.Collection('events');
Orders = new Mongo.Collection('orders');

var imageStore = new FS.Store.GridFS('images', {path: Meteor.absolutePath + '/public/uploads'});

Images = new FS.Collection('images', {
 stores: [imageStore]
});

Images.allow({
 	insert: function(){
		return true;
	},
	update: function(){
		return true;
	},
	remove: function(){
		return true;
	},
 	download: function(){
 		return true;
 	}
});

MenuList.allow({
	insert: function(userId){
		var group = Roles.getGroupsForUser(userId)[0];
		if(!Roles.userIsInRole(userId, 'user', group) || !userId){
			return false;
		}
		return true;
	},
	update: function(userId, doc){
		var group = Roles.getGroupsForUser(userId)[0];
		if(!Roles.userIsInRole(userId, 'user', group) || !userId){
			return false;
		}
		return true;
	},
	remove: function(userId, doc){
		var group = Roles.getGroupsForUser(userId)[0];
		if(!Roles.userIsInRole(userId, 'user', group) || !userId){
			return false;
		}
		return true;
	}
});

Events.allow({
	insert: function(userId, doc){
		var groups = Roles.getGroupsForUser(userId, 'creator');
		return groups.length!==0;
	},
 	update: function(userId){
		return !!userId;
	},
  	remove: function (userId, doc) {
    	return userId === doc.owner;
  	},
  fetch: ['owner']
});

Events.deny({
	update: function(userId, doc, fields){
		if (_.include(fields, 'state').length>0){
			return userId === doc.owner;
		}
	},
	fetch: ['owner']
});

Orders.allow({
	insert: function(userId){
		return !!userId;
	},
	update: function(userId){
		return !!userId;
	},
	remove: function(userId){
		return !!userId;
	}
});

