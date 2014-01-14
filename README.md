Squarespace Event List
======================

Take control of your Squarespace events blocks.

Squarespace has a built-in Event content type, but doesn't give you much
control of things like date formats or the display of start and end times
when listing events in a Summary block.

This is because, as of January 2014, the [developer documentation](http://developers.squarespace.com/blocks/) says,
"During the beta, we do not support customizing the HTML markup of our system blocks." 

Squarespace Event List is a YUI3 plugin that works around this limitation by
using AJAX to load your event location JSON and offers hooks to control the
display of the events.

Usage
-----

Copy the file ``sqs-event-list.js`` to the ``scripts`` directory in your template.

In your header template, e.g. ``header.region``:

```
<head>

  <!-- Your template's header stuff is up here ... --> 

  <!-- This should come near the end of the head element -->
  <squarespace:script src="sqs-event-list.js" combo="true" />
  
</head>
``` 

In your footer template, e.g. ``footer.region``:

```
<script>
Y.use('node', 'sqs-event-list', function(Y) {
  var container = Y.one('#block-c5e23e6af80eb09d47f0');
  if (container) { 
    container.plug(Y.Plugin.Sqs.EventList, {
      feedURL: '/calendar/?view=list&format=json',
      limit: 5
    });
  }
});
</script>
```

I use the default summary block's container as the selected element for
the plugin, so there's a fallback.

Options
-------

### feedUrl

The path to the JSON feed for your events collection.

Default: ``'/calendar/?view=list&format=json'``

### events

An array of event objects.  If non-empty, this will be used instead of
fetching the events from the URL.

Default: ``[]``

### containerTagName

The HTML tag used to enclose your list of events.

Default: ``ul``

### containerClass

The class(es) given to the container element.  This can be a string with a
single class name, or an array of strings if you want to give the element
multiple classes.

Default: ``sqs-event-list``

### itemTagName

The HTML tag used for a single event entry.

Default: ``li``

### itemClass

The class(es) given to the item element.  This can be a sgring with a
single class name, an array of strings (if you want to give the element
multiple classes) or a function that returns a string or array of strings.
The function takes an event object as an argument and binds ``this`` to the plugin instance. 

Default: none

### monthNames

A zero-indexed array mapping numeric months to their strings.  Keep 
in mind that the array is zero-indexed, so January has an index of 0, not 1.
This keeps with the convention of the JavaScript Date object.

This value can retrieved with ``this.get('monthNames')`` if you want to use
it in a custom ``dateFormat()`` implementation.

Default: ``['January', 'February', ...]``

### dateFormat

A function that takes a JavaScript Date object and returns a string
representation of the date.

Default: Function that returns a string like "February 4 at 7:35a"

### renderEvent

A function that takes an event object as an argument and returns the HTML
markup for the event.

Implement this to fully customize the display of events in your block.

The value of ``this`` is bound to the plugin instance.

Default: 

Function that returns HTML like this:

```
<a id="yui_3_10_1_1_1389730268482_502" href="/calendar/12/6/2013" class="title">Parent Eurythmy Class</a><div class="startDate">February 4 at 7:35a</div>
```

where the displayed date and time is the event's ``startDate`` property.

### limit

Only show this many events.

Default: 5

Author
------

Geoffrey Hing
