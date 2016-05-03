Meteor.publish('menulist', function() {
    return MenuList.find();
});

Meteor.publish('usersList', function() {
    return Meteor.users.find();
});

Meteor.publish(null, function() {
    return Meteor.roles.find({})
});

Meteor.publish('events', function() {
    return Events.find();
});

Meteor.publish('orders', function() {
    return Orders.find();
});

Meteor.publish('images', function() {
    return Images.find();
});