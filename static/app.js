$(function(){

	var TweetModel = Backbone.Model.extend();
	var TweetCollection = Backbone.Collection.extend(
    {
        model: TweetModel,
        
        initialize: function() {

        },
        url: function () {
		return 'http://search.twitter.com/search.json?q=' + this.query + '&page=' + this.page + '&callback=?';
        },
        query: 'manila',
        page: 1,
        parse: function(resp, xhr) {
        	return resp.results;
        }
    });

	var TweetController = Backbone.View.extend({
		initialize: function() {
			this.render();
		},
		render: function() {
			this.template = _.template($('#tweet-view-pic').html());
            var dict = this.model.toJSON();
            var markup = this.template(dict);
            this.el.innerHtml = markup;
            return this;
		}

	});

	var AppController = Backbone.View.extend({
		events: {
			"click #button": 'onclick'
		},
		onclick: function(){
			this.tweets.query=$('#q').val();
			$('ul').empty();
			this.loadTweets();

			
		},
		
		addTweet: function() {
			this.tweets.add({
				'text': 'tweeeeeetaaahhhh',
				'created_at': 'August 25, 2012'
			});
		},
		initialize: function () {


			this._tweetsView = [];

			this.tweets = new TweetCollection();
			//set event handlers
			_.bindAll(this, 'onTweetAdd');
			this.tweets.bind('add', this.onTweetAdd);

			this.loadTweets();
		},

		loadTweets: function () {
			var that = this;
			this.isLoading = true;
			this.tweets.fetch({
				add: that.onTweetAdd,
				success: function (tweets) {
					that.isLoading = false;
				}
			});

		},

		onTweetAdd: function(model) {
			console.log('tweet added', model.get('text'));
			var tweetController = new TweetController({
				model: model
			});

			this._tweetsView.push(tweetController);
			$(this.el).find('ul').append(tweetController.render().el.innerHtml);
		}
	});


	var app = new AppController({
		el: $('.twitter-feed')


	});
});