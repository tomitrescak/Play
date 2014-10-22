export var tomi = 1;
export var Content = new Meteor.Collection('Content'/*, {
  schema: new SimpleSchema({
    title: {
      type: String
    },
    content: {
      type: String
    },
    createdAt: {
      type: Date,
      denyUpdate: true
    }
  })
}*/);

export class momo {
  get tomi() {
    return 1;
  }
}

// Collection2 already does schema checking
// Add custom permission rules if needed
if (Meteor.isServer) {
  Content.allow({
    insert : () => true,
    update : () => true,
    remove : () => true
  });
}
