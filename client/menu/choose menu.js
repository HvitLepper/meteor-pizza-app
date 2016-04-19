Template.chooseMenu.helpers({
	pizza: function(){
		return MenuList.find({category: "pizza", group: Session.get('CurrentGroup')}, {sort: {price: 1}});
	},
	salads: function(){
		return MenuList.find({category: "salads", group: Session.get('CurrentGroup')}, {sort: {price: 1}});
	},
	drinks: function(){
		return MenuList.find({category: "drinks", group: Session.get('CurrentGroup')}, {sort: {price: 1}});
	},
	checkAccess: function(){
		if (Session.get('CurrentGroup')===undefined){
			return false;
		} else return true;
	},
	errorMessageAccess: function(){
		if (Session.get('CurrentGroup')===undefined){
			return 'Invalid Session. Please, return to EventList page and reenter by Take part button';
		} else return;
	},
	saladInsist: function(){
		return !! MenuList.findOne({category: "salads", group: Session.get('CurrentGroup')});
	},
	pizzaInsist: function(){
		return !! MenuList.findOne({category: "pizza", group: Session.get('CurrentGroup')});
	},
	drinksInsist: function(){
		return !! MenuList.findOne({category: "drinks", group: Session.get('CurrentGroup')});
	}
});

var nameItem=[];
var totalPrice=0;
var hadCoupon=[];

Template.chooseMenu.events({
	'click .remove': function(){
		MenuList.remove(this._id);
	},
	'click #confirm': function(){
		var eventCursor = Events.findOne({_id: Session.get('CurrentEvent')});
		if(nameItem.length===0 || totalPrice===0){
			throwError("Choose some item to order");
		} else {
				Events.update(eventCursor._id, {$addToSet: {votered: Meteor.userId()}});
					Orders.insert({
						eventId: eventCursor._id,
						userId: Meteor.userId(),
						ItemNames: nameItem,
						TotalPrice: totalPrice
				});
			$('.bg-success').removeClass('bg-success');
			nameItem=[];
			totalPrice=0;
			Router.go('showEvents');
			var menu = MenuList.find();
			menu.forEach(function(item){

			})
		}
	},
	'click .item': function(e){
		$(e.currentTarget).toggleClass("bg-success");
		var price;
		var name = this.name;		
		if(this.coupCount>0){
			price = 0;
			hadCoupon.push(name);
		} else {
			price = this.price;
		}
		
		if(nameItem.indexOf(name)<0){
			nameItem.push(name);
			totalPrice = totalPrice + price;
			if(this.coupCount>0){
				MenuList.update(this._id, {$inc: {coupCount: -1}});
			}
		} else {
			var index = nameItem.indexOf(name);
			nameItem.splice(index, 1);
			if (hadCoupon.indexOf(name)>-1){
				price = 0;
				MenuList.update(this._id, {$inc: {coupCount: 1}});
				hadCoupon.splice(hadCoupon.indexOf(name), 1);
			}
			
			totalPrice=totalPrice - price;
		}
	},
	'click #cancel': function(){
		Router.go('showEvents');
	}
});
