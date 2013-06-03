/*
 This is not production quality code.
*/

/*globals console*/

var pubsub =  (function () {
  "use strict";
  // topic callback list
  var topics = {},
    subscribers = {};

  function publish(owner, topic, data) {

    var i,
      len;

    if (!topics[topic]) {
      topics[topic] = {
        "owner": owner,
        "data": data
      };
    } else if (topics[topic].owner === owner) {
      topics[topic].data = data;
    } else {
      console.log('This topic is already taken');
    }

    if (!subscribers[topic]) {
      subscribers[topic] = [];
    }

    for (i = 0, len = subscribers[topic].length; i < len; i += 1) {
      subscribers[topic][i].callback.call(subscribers[topic][i], data);
    }
  }

  function subscribe(self, topic, callback) {

    if (!subscribers[topic]) {
      subscribers[topic] = [];
    }

    subscribers[topic].push({
      "subscriber": self,
      "callback": callback
    });
  }

  function unsubscribe(self, topic) {
    var i,
      len;

    if (!subscribers[topic]) {
      return;
    }

    for (i = 0, len = subscribers[topic].length; i < len; i += 1) {
      if (subscribers[topic][i].subscriber === self) {
        subscribers[topic].splice(i, 1);
        return;
      }
    }
  }

  return {
    "publish": publish,
    "subscribe": subscribe,
    "unsubscribe": unsubscribe
  };

}());

var s1 = {};
pubsub.subscribe(s1, '/map', function(data) {
  'use strict';
  console.log('s1 was notified with ' + data);
});

var s2 = {};
pubsub.subscribe(s2, '/map', function(data) {
  'use strict';
  console.log('s2 was notified with ' + data);
});

var p1 = {};
pubsub.publish(p1, '/map', "some data");
// => s1 was notified.
// => s2 was notified.

pubsub.unsubscribe(s2, '/map');

pubsub.publish(p1, '/map');
// => s1 was notified with undefined.