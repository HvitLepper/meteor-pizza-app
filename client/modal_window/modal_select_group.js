Template.selectGroup.helpers({
    group: function() {
        return Roles.getGroupsForUser(Meteor.userId(), 'creator');
    }
});

Template.selectGroup.events({
    'click .selectGroup': function() {
        if (pressedButtonHeader.get() === 'group') {
            Router.go('editGroup');
        }
        if (pressedButtonHeader.get() === 'event') {
            var group = currentGroup.get();
            var currentDate = moment().format('Do MMM YYYY hh:mm');
            var img = Images.findOne({group: group});

            if (!!img) {
                var imgUrl = '/cfs/files/images/' + img._id + '/' + img.original.name;
            }

            Events.insert({
                date: currentDate,
                owner: Meteor.userId(),
                state: 'ordering',
                group: group,
                imgUrl: imgUrl,
                voted: []
            });

            Meteor.call('sendNewEventEmails', group);
        }
        $('.modalWindowGroup').modal('hide');
    },
    'click input[name="groupItem"]': function(e, t) {
        var group = t.find('input:radio[name="groupItem"]:checked');
        currentGroup.set($(group).val());
    },
    'click cansel': function() {
        currentGroup.set(null);
    }
});