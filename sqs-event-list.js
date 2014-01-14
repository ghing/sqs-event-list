// sqs-event-list.js 0.0.1

// (c) 2014 Geoffrey Hing, Work Department LLC.
// sqs-event-list may be freely distributed under the MIT license.

YUI.add('sqs-event-list', function(Y) {
  var MONTH_NAMES = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  function formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var amPm = hours >= 12 ? 'p' : 'a';
    var monthNames = this.get('monthNames');

    if (hours === 0) {
      hours = 12;
    }
    else if (hours > 12) {
      hours = hours - 12;
    }

    minutes = minutes < 10 ? '0' + minutes : minutes;

    return monthNames[date.getMonth()] + " " + date.getDate() + " at " + hours + ":" + minutes + amPm; 
  }

  function renderEvent(evt) {
    var startDate = new Date(evt.startDate);
    var endDate = new Date(evt.endDate);
    var formatDate = Y.bind(this.get('dateFormat'), this);

    var eventHtml = '<a href="' + evt.fullUrl + '" class="title">' + evt.title + '</a>';
    eventHtml += '<div class="startDate">' + formatDate(startDate) + '</div>';
    return eventHtml;
  }

  function EventList(config) {
    EventList.superclass.constructor.apply(this, arguments);
  }

  EventList.NAME = "eventList";

  EventList.NS = "eventList";

  EventList.ATTRS = {
    feedUrl: {
      value: '/calendar/?view=list&format=json',
      writeOnce: true
    },

    events: {
      value: []
    },

    containerTagName: {
      value: 'ul',
      writeOnce: true
    },

    containerClass: {
      value: 'sqs-event-list',
      writeOnce: true
    },

    itemTagName: {
      value: 'li',
      writeOnce: true
    },

    // This can be a single class as a string, an array of class names, or
    // a function that takes the event object as an argument and returns
    // a string or array of strings.
    itemClass: {
      value: '',
      writeOnce: true
    },

    monthNames: {
      value: MONTH_NAMES,
      writeOnce: true
    },

    dateFormat: {
      value: formatDate,
      writeOnce: true
    },

    renderEvent: {
      value: renderEvent,
      writeOnce: true
    },

    limit: {
      value: 5,
      writeOnce: true
    }
  };

  Y.extend(EventList, Y.Plugin.Base, {
    initializer: function() {
      var plugin = this;
      var events = this.get('events');
      var feedUrl = this.get('feedUrl');
      var limit = this.get('limit');

      if (!events.length) {
        Y.io(feedUrl, {
          on: {
            success: function(id, o, args) {
              var data = Y.JSON.parse(o.responseText);
              if (data.upcoming) {
                plugin.set('events', data.upcoming.splice(0, limit));
                plugin.renderEvents();
              }
            }
          }
        });
      }
    },
    
    renderEvents: function() {
      var plugin = this;
      var host = this.get('host');
      var events = this.get('events');
      var itemTagName = this.get('itemTagName');
      var itemClass = this.get('itemClass');
      var itemTemplateSrc = this.get('itemTemplate');
      var renderEvent = Y.bind(this.get('renderEvent'), this);

      // Clear the container's contents
      host.setHTML('');

      var container = Y.Node.create('<' + this.get('containerTagName') + '/>');
      container.addClass(this.get('containerClass')); 
      container.appendTo(host);

      Y.Array.each(events, function(evt) {
        var item = Y.Node.create('<' + itemTagName + '/>'); 
        if (Y.Lang.isFunction(itemClass)) {
          item.addClass(itemClass(evt));
        }
        else {
          item.addClass(itemClass);
        }
        item.setHTML(renderEvent(evt));
        item.appendTo(container);
      });
    }
  });

  Y.namespace("Plugin.Sqs").EventList = EventList;

}, '0.0.1', {
  requires: ['plugin', 'io', 'json-parse']
});
