Template.createGroup.events({
	'submit #newGroup': function (e){
		e.preventDefault();
		var groupName = e.target.name.value;
		if (!!groupName){
			Meteor.call('setCreator', groupName, function (error) {
				if (error) {
			   		throwError(error.reason);
				}
 		 	});
			Router.go('showEvents');
		} else {
			throwError('Field name is empty!');
		}
	},
	'click #cancel': function(){
		Router.go('showEvents');
	},
	'change .myFileInput': function(e, t) {
    	FS.Utility.eachFile(e, function(file) {
        	var fsFile = new FS.File(file);
	        var groupName = t.find('#groupName').value;
    	    if (!!Images.findOne({groupName: groupName})){
        	   	var Id = Images.findOne({groupName: groupName})._id;
           		Images.update({_id: Id}, {$set: fsFile});
      		  } else {
          		fsFile.groupName = groupName;
	           	Images.insert(fsFile,function(err,result){
    	        if(err){
        	        throwError(err.reason);
       				}
				});
	    	}            
    	});
	}
});

Template.editGroup.helpers({
	users: function(){
		return Meteor.users.find();
	},
	usersInGroup: function(){
		var group = Session.get('CreatorGroup');
			return Roles.getUsersInRole('user', group);
	}
});

Template.editGroup.events({
	'submit form': function(e){
		e.preventDefault();
		var group = Session.get('CreatorGroup');
		var user = e.target.addWho.value;
		var id = Meteor.users.findOne({username: user})._id;
		Meteor.call('setUserRole', id, group, function (error) {
			if (error) {
			   throwError("Can't add role to user");
			}
 		 });
	},
	'click .remove': function(){
		var user = this._id;
		var group = Session.get('CreatorGroup');
		Meteor.call('removeRole', user, group);
	},
	'click #cancel': function(){
		Router.go('showEvents');
	}
});
