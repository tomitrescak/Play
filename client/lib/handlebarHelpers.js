Template.registerHelper('isActiveRoute', function (siteName) {
  var current = Router.current();

  if ('undefined' !== typeof current && current !== null) {
    return current.route.name == siteName ? 'active' : 'not-active';
  }

  return 'not-active';
});

Template.registerHelper('debug', function (optionalValue) {
  if (typeof console !== "undefined" || typeof console.log !== "undefined") {
    console.log("Current Context");
    console.log("====================");
    console.log(this);
    if (optionalValue) {
      console.log("Value");
      console.log("====================");
      console.log(optionalValue);
    }

    return '';
  }

  // For IE8
  alert(this);

  if (optionalValue) {
    alert(optionalValue);
  }

  return '';
});

Template.registerHelper('siteTitle', function(string) {
  return SEO.settings.title;
});

Template.registerHelper('cutText', function(str, num) {
  if (str.length > num) {
    return str.substring(0, num) + '...';
  }
  return str;
});

Template.registerHelper('niceTime', function(date) {
  return moment(date).fromNow();
});

Template.registerHelper('first', function(arr) {
  return arr[0];
});

Template.registerHelper('genreToText', function(index) {
  switch(parseInt(index)) {
    case 1:
      return "Action";
    case 2:
      return "Fighting";
    case 3:
      return "Shooter";
    case 4:
      return "Adventure";
    case 5:
      return "Role-playing";
    case 6: 
      return "Simulation";
    case 7:
      return "Strategy";
    case 8:
      return "Sports";
    default:
      return "Unknown: " + index;
  }
});

Template.registerHelper('summarize', function(string) {
  var cleanString = _(string).stripTags();
  return _(cleanString).truncate(140);
});

Template.registerHelper('parentData', function(parentContext, item) {
  return parentContext[item];
});

