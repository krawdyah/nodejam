var mongoose = require('mongoose')
  , User = mongoose.model('User');

exports.logout = function (request, response) {
  request.logout()
  response.redirect('/')
}

exports.session = function (request, response) {
  if (!request.user) { return response.redirect('#/login'); }
  response.redirect('#/profile');
}

exports.update = function (request, response, next) {
  User.findById(request.user.id, 
    function(err, user){ 
      user.password = request.body.password 
      user.save(function (err, user) {
        if (err) return next(err)
        if (!user) return next(new Error('Failed to load User ' + id))
        request.profile = user
      });
    });
  response.redirect('#/profile')
}

exports.create = function (request, response) {
  var user = new User(request.body)
  user.save(function (err) {
    if (err) {
      console.log(err.errors);
      return response.render('index', {
        errors: err.errors,
        user: user,
        title: 'Sign up'
      })
    }

    request.logIn(user, function(err) {
      if (err) return next(err)
      return response.redirect('#/profile')
    })
  })
}

exports.profile = function (request, response) {
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(request.user));
}
