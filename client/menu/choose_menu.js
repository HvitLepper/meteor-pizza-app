Meteor.subscribe('menulist');
Meteor.subscribe('orders');

var selectItemsByCategory = function(category) {
    return MenuList.find({category: category, group: currentGroup.get()}, {sort: {price: 1}});
}

var hasAnyItemCategory = function(category) {
    return !!MenuList.findOne({category: category, group: currentGroup.get()});
}

Template.chooseMenu.helpers({
    pizza: function() {
        return selectItemsByCategory('pizza');
    },
    salads: function() {
        return selectItemsByCategory('salads');
    },
    drinks: function() {
        return selectItemsByCategory('drinks');
    },
    checkAccess: function() {
        if (currentGroup.get() === undefined) {
            return false;
        }
        return true;
    },
    errorAccessMessage: function() {
        if (currentGroup.get() === undefined) {
            return 'Invalid Session. Please, return to Events page and reenter by Take Part button';
        }
        return;
    },
    pizzaPresent: function() {
        return hasAnyItemCategory('pizza');
    },
    saladsPresent: function() {
        return hasAnyItemCategory('salads');
    },
    drinksPresent: function() {
        return hasAnyItemCategory('drinks');
    }
});

var selectedItems = [];
var priceSum = 0;
var haveCoupon = [];

Template.chooseMenu.events({
    'click .remove': function() {
        MenuList.remove(this._id);
    },
    'click #confirm': function() {
        if (selectedItems.length === 0 || priceSum === 0) {
            throwError("Choose some item to order");
        } else {
            Events.update(currentEventId.get(), {$addToSet: {voted: Meteor.userId()}});
            
            Orders.insert({
                eventId: currentEventId.get(),
                userId: Meteor.userId(),
                items: selectedItems,
                priceSum: priceSum
            });

            $('.bg-success').removeClass('bg-success');
            selectedItems = [];
            priceSum = 0;
            haveCoupon = [];

            Router.go('showEvents');
        }
    },
    'click .item': function(e) {
        $(e.currentTarget).toggleClass("bg-success");
        
        var price;
        var name = this.name;

        if (this.couponCount > 0) {
            price = 0;
            haveCoupon.push(name);
        } else {
            price = this.price;
        }

        if (selectedItems.indexOf(name) < 0) {
            selectedItems.push(name);
            priceSum = priceSum + price;

            if (this.couponCount > 0) {
                MenuList.update(this._id, {$inc: {couponCount: -1}});
            }

        } else {
            var index = selectedItems.indexOf(name);
            selectedItems.splice(index, 1);

            if (haveCoupon.indexOf(name) > -1) {
                price = 0;
                MenuList.update(this._id, {$inc: {couponCount: 1}});
                haveCoupon.splice(haveCoupon.indexOf(name), 1);
            }

            priceSum = priceSum - price;
        }
    },
    'click .cancel': function() {
        Router.go('showEvents');
    }
});