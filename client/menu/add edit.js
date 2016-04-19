Template.addMenuItem.helpers({
	creatorCoup: function(){		
		return  !! Roles.getGroupsForUser(Meteor.userId(), 'creator')[0];
	},
	NumberHidden: function(){
		if(!! Roles.getGroupsForUser(Meteor.userId(), 'creator')[0]){
			return 'number';
		} else {
			return 'hidden';
		}
	}
});

Template.addMenuItem.events({
	'submit form': function(e){
		e.preventDefault();
		var itemName = e.target.name.value;
		var itemPrice = e.target.price.value;
		var itemCategory = e.target.category.value;
		var coupCount = e.target.count.value;
		if (coupCount==='0'){
			coupon='';
		} else {
			coupon="free";
		}
		var group = Session.get('CurrentGroup');
		if (!itemName){
			throwError("Item name is empty");
		}
		if (!itemPrice){
			throwError("Item price is empty");
		} else {
			MenuList.insert({
				name: itemName,
				price: parseInt(itemPrice),
				category: itemCategory,
				coupon: coupon,
				coupCount: parseInt(coupCount),
				group: group
			});
		}
	}
		
});




Template.editItem.helpers({
	creatorCoup: function(){		
		return  !! Roles.getGroupsForUser(Meteor.userId(), 'creator')[0];
	},
	NumberHidden: function(){
		if(!! Roles.getGroupsForUser(Meteor.userId(), 'creator')[0]){
			return 'number';
		} else {
			return 'hidden';
		}
	}
});


Template.editItem.events ({
	'submit form': function(e){
		e.preventDefault();
		var itemName = e.target.name.value;
		var itemPrice = e.target.price.value;
		var coupCount = e.target.count.value;
		var coupon;
		if (coupCount==='0'){
			coupon='';
		} else {
			coupon="free";
		}
		var data={
			name: itemName,
			price: parseInt(itemPrice),
			coupCount: parseInt(coupCount),
			coupon: coupon
		};
		MenuList.update(this._id, {$set: data});
		Router.go('chooseMenu');
	},
	'click #cancel': function(){
		Router.go('chooseMenu');
	}
});

