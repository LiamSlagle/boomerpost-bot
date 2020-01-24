var Twit = require('twit');
var r = require('./resources.json');

var T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

var templates = {
  justCheckingIn: function() {
    return sample(r.handles) + ' ' + sample(r.greetings) +
      sample(r.punctuation) + "just checking in" +
      sample(r.punctuation) + sample(r.goodbyes) + ' ' +
      sample(r.first_person)
  },
  didYouReceiveMyMessage: function() {
    return sample(r.handles) + ' ' + sample(r.greetings) +
      sample(r.punctuation) +
      sample([sample(r.uncertainty), sample(r.desire)]) +
      sample([' you ', ' u ']) + sample(['got', 'received']) + ' my ' +
      sample(r.message_types) + sample(r.punctuation) +
      sample([sample(r.random)])
  },
  hopeFamilyWell: function() {
    return sample(r.handles) + ' ' + sample(r.greetings) +
      sample(r.punctuation) + sample(r.desire) + ' ' +
      sample(r.your_relatives) + sample([' is ', ' are ']) +
      sample(r.doing_well) + sample(r.punctuation) +
      sample(['', sample(r.random)])
  },
  familyMemberDead: function() {
    return sample(['', sample(r.handles) + ' ']) +
      sample(['', sample(r.greetings) + ' ']) +
      sample(['', sample(r.sorrow) + ' ']) +
      sample([sample(r.my_relatives), sample(r.your_relatives)]) + ' ' +
      sample(r.death) + sample(r.punctuation) +
      sample(['', sample(r.random)])
  },
  bookClub: function() {
    return sample(r.handles) + ' ' +
      sample(['', sample(r.greetings) + ' ']) +
      sample(['', sample(r.desire) + ' to see you at ']) + 'book club ' +
      sample(r.dates)
  },
  proudOfYou: function() {
    return sample(r.handles) + ' ' +
      sample(r.greetings) + ' ' +
      sample(r.proud) + ' of your' + sample(r.accomplishments) +
      sample(r.punctuation) + sample(r.goodbyes) + sample(r.first_person)
  },
  corporation: function() {
    //return smaple(r.corporate_handles) + ' ' +
      //sample(['', sample(r.greetings) + ' ']) + 'my ' +
      //sample(r.my_relatives) + 
  },
  recipe: function() {
  }
};

var lastTemplate = 'justCheckingIn';
var markovChain = {
  justCheckingIn: ['didYouReceiveMyMessage', 'hopeFamilyWell',
    'familyMemberDead', 'bookClub', 'proudOfYou', 'corporation', 'recipe'],
  didYouReceiveMyMessage: ['justCheckingIn', 'hopeFamilyWell',
    'familyMemberDead', 'bookClub', 'proudOfYou', 'corporation', 'recipe'],
  hopeFamilyWell: ['justCheckingIn', 'didYouReceiveMyMessage',
    'familyMemberDead', 'bookClub', 'proudOfYou', 'corporation', 'recipe'],
  familyMemberDead: ['justCheckingIn', 'didYouReceiveMyMessage',
    'hopeFamilyWell', 'bookClub', 'proudOfYou', 'corporation', 'recipe'],
  bookClub: ['justCheckingIn', 'didYouReceiveMyMessage', 'hopeFamilyWell',
    'familyMemberDead', 'proudOfYou', 'corporation', 'recipe'],
  proudOfYou: ['justCheckingIn', 'didYouReceiveMyMessage', 'hopeFamilyWell',
    'familyMemberDead', 'bookClub', 'corporation', 'recipe'],
  corporation: ['justCheckingIn', 'didYouReceiveMyMessage', 'hopeFamilyWell',
    'familyMemberDead', 'bookClub', 'proudOfYou', 'recipe'],
  recipe: ['justCheckingIn', 'didYouReceiveMyMessage', 'hopeFamilyWell',
    'familyMemberDead', 'bookClub', 'proudOfYou', 'corporation'],
};

function postTweet(tweet) {
  T.post('statuses/update', { 
    status: tweet + sample(['', sample(r.punctuation) + sample(r.send_tweet)])
  }, function(error, data, response) {
      if (error) {
        console.log(error);
      } else {
        console.log('Success: ' + data.text);
        console.log(response);
      }
    }
  );
  console.log(tweet);
};

function sample(array) {
  return array[Math.floor(Math.random() * array.length)];
};

function createTweet() {
  // fill the template
  let tweet = templates[lastTemplate]();

  // post the tweet
  if(tweet !== '') {
    postTweet(tweet);
  }

  // pick a template
  lastTemplate = sample(markovChain[lastTemplate]);
};

createTweet();
setInterval(createTweet, 2*60*1000);
