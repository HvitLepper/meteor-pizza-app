Tracker.autorun(function() {
    var eventCursors = Events.find();

    eventCursors.forEach(function(ev) {
        var votedCount = ev.voted.length;
        var group = ev.group;

        Meteor.call('allVotedFromGroup', votedCount, group, function(err, allVoted) {
            if (allVoted && ev.state === 'ordering') {
                Events.update(ev._id, {$set: {state: 'ordered'}});

                Meteor.call('createAndSendScores', ev._id, group);
            }
        });       
    });

    var menuItems = MenuList.find();

    menuItems.forEach(function(item) {
        if(item.couponCount === 0) {
            MenuList.update(item._id, {$set: {coupon: ''}});
        }
        if(item.couponCount === 1) {
            MenuList.update(item._id, {$set: {coupon: 'free'}});
        }
    });
});