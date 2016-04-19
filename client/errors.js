throwError = function (errMessage){
	Errors.insert({message: errMessage});
}

Template.errors.helpers({
  errors: function() {
    return Errors.find();
  }
});

Template.errors.events({
	'click .close': function(){
		Errors.remove({_id: this._id});
	}
})