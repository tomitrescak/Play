// Use "./meteor-boilerplate create:model" to create new models
// ...
// Also creates files in server/publications and client/subscriptions

makeSafeFileName = function(name) {
  return name.replace(/\.\./g, '');
}
