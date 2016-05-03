setFieldType = function () {
	if( isThisUserCreator() ) {
		return 'number';
	}
	return 'hidden';
}

Template.addMenuItem.helpers({
	creator: function(){
		return  isThisUserCreator();
	},
	NumberHidden: function() {
		return setFieldType();
	}
});

setCoupon = function(couponCount) {
	if (!couponCount) {
		return '';
	} else {
		return "free";
	}
};

var duplicateItem = function(name) {
	return !!MenuList.findOne({name: name, group: currentGroup.get()});
}

Template.addMenuItem.events({
	'submit form': function(e) {
		e.preventDefault();

		var itemName = e.target.name.value;
		var itemPrice = e.target.price.value;
		var itemCategory = e.target.category.value;
		var couponCount = e.target.couponCount.value;
		var coupon = setCoupon(couponCount);

		itemPrice = parseInt(itemPrice);

		if (!itemName) {
			throwError("Item name is empty");
		} else if ( duplicateItem(itemName) ) {
			throwError("This item is already exist in the group");
		} else if (!itemPrice) {
			throwError("Item price is empty or not a number");
		} else {
			MenuList.insert({
				name: itemName,
				price: itemPrice,
				category: itemCategory,
				coupon: coupon,
				couponCount: parseInt(couponCount),
				group: currentGroup.get()
			});
		}
	}		
});