Template.selectGroup.helpers({
	group: function(){
		return Roles.getGroupsForUser(Meteor.userId(), 'creator');
	}
});

Template.selectGroup.events({
	'click .selectGroup': function(){
		if(Session.equals('Button', 'group')){
			Router.go('editGroup');
		}
		if (Session.equals('Button', 'event')){
			var group = Session.get('CreatorGroup');
			var date = moment().format('Do MMM YYYY hh:mm');
			var img = Images.findOne({groupName: group});
				if(!!img){
					var imgUrl = '/cfs/files/images/' + img._id + '/' + img.original.name;
				}
			Events.insert({
				date: date,
				owner: Meteor.userId(),
				state: 'ordering',
				group: group,
				imgUrl: imgUrl,
				votered: []
			});
			Meteor.call('EventEmailNotification', group);
		}
		$('.modalWindowGroup').modal('hide');
	},
	'click input[name="groupItem"]': function(e, t){
		var group = t.find('input:radio[name="groupItem"]:checked');
		Session.set('CreatorGroup', $(group).val());
	},
	'click cansel': function(){
		Session.set('CreatorGroup', '');
	}
});