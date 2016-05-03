Template.editItem.helpers({
	creator: function() {
		return  isThisUserCreator();
	},
	NumberHidden: function() {
		return setFieldType();
	}
});

Template.editItem.events ({
	'submit form': function(e) {
		e.preventDefault();	

		var itemPrice = e.target.price.value;
		var couponCount = e.target.couponCount.value;
		var coupon = setCoupon(couponCount);
		
		var data = {
			name: e.target.name.value,
			price: parseInt(itemPrice),
			couponCount: parseInt(couponCount),
			coupon: coupon
		};
		
		MenuList.update(this._id, {$set: data});
		Router.go('chooseMenu');
	},
	'click #cancel': function() {
		Router.go('chooseMenu');
	}
});