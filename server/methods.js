Meteor.methods({
    setUserRole: function(Id, group) {
        if (!this.userId || !group) {
            throw new Meteor.Error(403, "Access denied");
        }
        Roles.setUserRoles(Id, 'user', group);
    },
    setCreator: function(group) {
        var creatorId = Roles.getUsersInRole('creator', group).fetch()[0]._id;
        if (!!creatorId && creatorId !== this.userId) {

            throw new Meteor.Error(403, "Group is already exist");
        };
        if (!this.userId) {
            throw new Meteor.Error(403, "Access denied");
        };
        Roles.setUserRoles(this.userId, ['creator', 'user'], group);
    },
    removeUserFromRole: function(Id, group) {
        if (!this.userId || !group) {
            throw new Meteor.Error(403, "Access denied");
        }
        Roles.removeUsersFromRoles(Id, 'user', group);
    },
    sendNewEventEmails: function(group) {
        var users = Roles.getUsersInRole('user', group);

        users.forEach(function(user) {
            var address = user.emails[0].address;
            var subject = 'New event from ' + group;
            var html = 'Please, go to http://localhost:3000/ for participate in event.';

            sendEmail(address, subject, html);
        });
    },
    allVotedFromGroup: function(votedUsers, group) {
        var usersInGroup = Roles.getUsersInRole('user', group).count();
        if(usersInGroup === votedUsers) {
            return true;
        }
        return false;
    },
    createAndSendScores: function(id, group) {
        var priceTotal = 0;
        var itemList = [];
        var subject = 'Total amount from event by ' + group;
        var orderCursors = Orders.find({eventId: id});
        var creatorHTML = '';        

        var creatorId = Roles.getUsersInRole('creator', group).fetch()._id;
        var creatorAddress = Meteor.users.findOne({id: creatorId}).emails[0].address;

        orderCursors.forEach(function(order) {
            var user = Meteor.users.findOne({_id: order.userId});
            var userId = user._id;
            var userName = user.username;
            var address = user.emails[0].address;
            var selectedItems = order.items.join('; ');
            var html = 'Your order contents: ' + selectedItems + '<br>Total amount: $' + order.priceSum;

            if (!(Roles.userIsInRole(userId, 'creator', group))) {
                sendEmail(address, subject, html);
            } else {
                creatorHTML = html;
            }

            priceTotal = priceTotal + order.priceSum;
            itemList = itemList.concat(order.items);

            Orders.remove(order._id);
        });

        html = createTotalScore(itemList, priceTotal, creatorHTML);        

        sendEmail(creatorAddress, subject, html);
    }
});