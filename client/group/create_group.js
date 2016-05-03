Meteor.subscribe('images');

Template.createGroup.events({
	'submit #newGroup': function(e) {
		e.preventDefault();

		var group = e.target.name.value;

		if (!!group){
			Meteor.call('setCreator', group, function (error) {
				if (error) {
			   		throwError(error.reason);
				}
 		 	});

			Router.go('showEvents');
		} else {
			throwError('Field name is empty!');
		}
	},
	'click #cancel': function() {
		Router.go('showEvents');
	},
	'change .myFileInput': function(e, t) {
    	FS.Utility.eachFile(e, function(file) {
        	var fsFile = new FS.File(file);
	        var group = t.find('#groupName').value;
	        var imgPresent = Images.findOne({group: group});

    	    if (!!imgPresent) {
           		Images.update({_id: imgPresent._id}, {$set: fsFile});
      		  } else {
          		fsFile.group = group;
	           	Images.insert(fsFile,function(err) {
    	        if (err) {
        	        throwError(err.reason);
       				}
				});
	    	}            
    	});
	}
});