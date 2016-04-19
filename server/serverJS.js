Meteor.publish('menulist', function(){
	return MenuList.find();
});
Meteor.publish('usersList', function(){
	return Meteor.users.find();
});
Meteor.publish(null, function (){ 
       return Meteor.roles.find({})
});
Meteor.publish('events', function(){
	return Events.find();
});
Meteor.publish('orders', function(){
	return Orders.find();
});

Meteor.publish('images', function(){ return Images.find(); });

Meteor.startup(function(){
	process.env.MAIL_URL="smtp://pizza.app.meteor%40gmail.com:pizzapass@smtp.gmail.com:465/";
});

//Accounts.emailTemplates.from = "postmaster@sandboxe1c7013f76764117a3f8b5a296ab4c35.mailgun.org";

Meteor.methods({
	setUserRole: function(Id, group){		
		if (!this.userId || !group){
			throw new Meteor.Error(403, "Access denied");
		}
		Roles.setUserRoles(Id, 'user', group);
	},
	setCreator: function(group){
		if(!this.userId){			
			throw new Meteor.Error(403, "Access denied");
		};
		Roles.setUserRoles(this.userId, ['creator', 'user'], group);
	},
	removeRole: function(Id, group){		
		if (!this.userId || !group){
			throw new Meteor.Error(403, "Access denied");
		}
		Roles.removeUsersFromRoles(Id, 'user', group);
	},
	EventEmailNotification: function(group){
		var users = Roles.getUsersInRole('user', group);
		users.forEach(function(user){
			Email.send({
				to: user.emails[0].address,
				from: 'pizza.app.meteor@gmail.com',
				subject: 'New event from '+group,
				text: 'Please, go to http://localhost:3000/ for taking part in event.'
			});
		});
	},
	CountOrders: function(id, group){
		var count = Roles.getUsersInRole('user', group).count();
		var votered = Events.findOne({_id: id}).votered;
		var state = Events.findOne({_id: id}).state;
		if (votered.length == count && state=='ordering'){
			Events.update(id, {$set: {state: 'ordered'}});
			var amoutPrice = 0;
			var listItem = [];
			var orderCursor = Orders.find({eventId: id});
			var creatorHTML;
			var creatorId;
			orderCursor.forEach(function (order){
				var userId = Meteor.users.findOne({_id: order.userId})._id;
				var userName = Meteor.users.findOne({_id: order.userId}).username;
				var strArr= order.ItemNames.join('; ');
				var html =  'Your order contents: '+strArr+'<br>Total amount: $'+order.TotalPrice;
				if (!(Roles.userIsInRole(userId, 'creator', group))){
					var currentUser = Meteor.users.findOne({_id: userId});
					Email.send({
						to: currentUser.emails[0].address,
						from: 'pizza.app.meteor@gmail.com',
						subject: 'Total amount from event by '+group,
						html: html
					});		
				} else {
					creatorHTML = html;
					creatorId = userId;
				}
				amoutPrice=amoutPrice+order.TotalPrice;
				listItem=listItem.concat(order.ItemNames);
			});
			orderCursor.forEach(function (order){
				Orders.remove(order._id);
			});
			var creator = Meteor.users.findOne({_id: creatorId});
			var listItemTotal = [];
			listItemTotal.push({count: 1, name: listItem[0]});
			listItem.splice(0,1);
			listItem.forEach(function(item){
				for(var i=0; i<listItemTotal.length; i++){
					if(listItemTotal[i].name==item){
  						listItemTotal[i].count++;
   						var found = true;
   						break;
   					}
				};
				if(!found){
    				listItemTotal.push({count: 1, name: item});
  				}
			});
			var allItemHTML='';
			listItemTotal.forEach(function(item){
  				allItemHTML=allItemHTML+item.name+'('+item.count+')'+'<br>';
			});
			var creatorTotalHTML=creatorHTML+'<hr>Summary items:<br>'+allItemHTML+'Summary price: $'+amoutPrice;
			Email.send({
						to: creator.emails[0].address,
						from: 'pizza.app.meteor@gmail.com',
						subject: 'Total amount from event by '+group,
						html: creatorTotalHTML
					});	
		}
	}
});