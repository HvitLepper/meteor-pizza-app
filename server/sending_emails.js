Meteor.startup(function() {
    process.env.MAIL_URL = "smtp://pizza.app.meteor%40gmail.com:pizzapass@smtp.gmail.com:465/";
});

sendEmail = function(address, subject, html) {
    Email.send({
        to: address,
        from: 'pizza.app.meteor@gmail.com',
        subject: subject,
        html: html
    });
}