Backbone.Model.prototype.idAttribute = '_id';

// Backbone Model

var User = Backbone.Model.extend({
	defaults: {
		name: '',
		surname: '',
		age: ''
	}
});

/*
$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
    options.crossDomain ={
        crossDomain: false
    };
    options.xhrFields = {
        withCredentials: true
    };
});
*/

// Backbone Collection

var Users = Backbone.Collection.extend({
  url: 'http://13.58.100.44:3000/api/users'
});

// instantiate two Users

/*var user1 = new User({
	name: 'Michael',
	surname: 'Michael\'s User',
	age: 'http://michaelsuser.com'
});
var user2 = new User({
	name: 'John',
	surname: 'John\'s User',
	age: 'http://johnsuser.com'
});*/

// instantiate a Collection

var users = new Users();

// Backbone View for one user

var UserView = Backbone.View.extend({
	model: new User(),
	tagName: 'tr',
	initialize: function() {
		this.template = _.template($('.users-list-template').html())
	},
	events: {
		'click .edit-user': 'edit',
		'click .update-user': 'update',
		'click .cancel': 'cancel',
		'click .delete-user': 'delete'
	},
	edit: function() {
		$('.edit-user').hide();
		$('.delete-user').hide();
		this.$('.update-user').show();
		this.$('.cancel').show();

		var name = this.$('.name').html();
		var surname = this.$('.surname').html();
		var age = this.$('.age').html();

		this.$('.name').html('<input type="text" class="form-control name-update" value="' + name + '">');
		this.$('.surname').html('<input type="text" class="form-control surname-update" value="' + surname + '">');
		this.$('.age').html('<input type="text" class="form-control age-update" value="' + age + '">');
	},
	update: function() {
		this.model.set('name', $('.name-update').val());
		this.model.set('surname', $('.surname-update').val());
		this.model.set('age', $('.age-update').val());
        this.model.save(null, {
          success: function(response) {
            console.log('Successfully UPDATED _id: ' + response.toJSON()._id);
            usersView.initialize()
          },
          error: function(response) {
            console.log('Failed update')
          } 
        })
	},
	cancel: function() {
		usersView.render();
	},
	delete: function() {
		this.model.destroy({
          success: function(response) {
            console.log('Successfully DELETED _id: ' + response.toJSON()._id)
          },
          error: function(response) {
            console.log('Failed delete')
          } 
        });
	},
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

// Backbone View for all users

var UsersView = Backbone.View.extend({
	model: users,
	el: $('.users-list'),
	initialize: function() {
		var self = this;
		this.model.on('add', this.render, this);
		this.model.on('change', this.render ,this);
		this.model.on('remove', this.render, this);
        this.model.fetch({
          success: function(response) {
            _.each(response.toJSON(), function(item) {
              console.log('successfully GOT user with _id: ' + item._id);
            })
          },
          error: function(response) {
            console.log('Failed')
          }
      })
	},
	render: function() {
		var self = this;
		this.$el.html('');
		_.each(this.model.toArray(), function(user) {
			self.$el.append((new UserView({model: user})).render().$el);
		});
        console.log('rendered');
		return this;
	}
});

var usersView = new UsersView();

$(document).ready(function() {
	$('.add-user').on('click', function() {
		var user = new User({
			name: $('.name-input').val(),
			surname: $('.surname-input').val(),
			age: $('.age-input').val()
		});
		$('.name-input').val('');
		$('.surname-input').val('');
		$('.age-input').val('');
		console.log(user.toJSON());
		users.add(user);
      
        user.save(null, {
          success: function(response) {
            console.log('Successfully ADDED used with _id: ' + response.toJSON()._id);
          },
          error: function(response) {
          console.log('Failed')
           }
        })
	})
})
