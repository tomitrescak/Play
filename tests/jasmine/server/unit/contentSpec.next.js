describe('Content', () => {
  'use strict';

  var doc = {
    title: 'title',
    description: 'description',
    genre: 'RPG',
    owner: 'owner',
    ownerId: 'ownerId',
    createdOn: 'today1',
    modifiedOn: 'today2',
    screens: ['path1', 'path2'],
    files: [{path: 'file1', os: 'mac64'}],
    rating: 8,
    version: {identifier: '1.0', info: 'info'}
  }

  it('can be created', () => {
    var content = new Content(doc);

    expect(content).toBeDefined();
    expect(content.title).toBe('title');
    expect(content.description).toBe('description');
    expect(content.genre).toBe('RPG');
    expect(content.owner).toBe('owner');
    expect(content.ownerId).toBe('ownerId');
    expect(content.createdOn).toBe('today1');
    expect(content.modifiedOn).toBe('today2');
    expect(content.screens).toEqual(['path1', 'path2']);
    expect(content.files).toEqual([{path: 'file1', os: 'mac64'}]);
    expect(content.rating).toBe(8);
    expect(content.version.identifier).toBe('1.0');
    expect(content.version.info).toBe('info');
  });

  it('has correct accessors', () => {
    var content = new Content();
    content.title = 'A';
    expect(content.title).toBe('A');

    content.description = 'B';
    expect(content.description).toBe('B');

    content.genre = 'C';
    expect(content.genre).toBe('C');

    expect(() => { content.owner = 'me' }).toThrow(new TypeError());
    expect(() => { content.ownerId = 'me' }).toThrow(new TypeError());
    expect(() => { content.createdOn = 'me' }).toThrow(new TypeError());
    expect(() => { content.modifiedOn = 'me' }).toThrow(new TypeError());
    expect(() => { content.screens = 'me' }).toThrow(new TypeError());
    expect(() => { content.files = 'me' }).toThrow(new TypeError());
    expect(() => { content.rating = 'me' }).toThrow(new TypeError());
    expect(() => { content.version = 'me' }).toThrow(new TypeError());

  });

  it('returns correct url title', () => {
    var d = {title: 'A'};
    var content = new Content(d);
    expect(content.urlTitle).toBe('A');

    content.title = 'A B';
    expect(content.urlTitle).toBe('A-B');

    content.title = 'A1  -_B1!@#$%^&;C';
    expect(content.urlTitle).toBe('A1-B1-C');
  });

  it ('saves data to database', () => {
    var content = new Content(doc);

    spyOn(Contents, 'insert').and.returnValue('1');
    spyOn(Meteor, 'user').and.returnValue({
      profile: { name: 'Tomi '}
    });
    spyOn(Meteor, 'userId').and.returnValue('id1');

    content.save();

    expect(Contents.insert).toHaveBeenCalledWith(
      {
        title: 'title',
        description: 'description',
        genre: 'RPG',
        modifiedOn : jasmine.any(Date),
        createdOn : jasmine.any(Date),
        owner : 'Tomi ',
        ownerId : 'id1',
        rating : 0,
        files : [ ],
        screens : [ ],
        version : '0.0'
      },
      jasmine.any(Function)
    );

    expect(content.id).toBe('1');
  });

  it ('updates data in the database', () => {
    doc._id = '1';
    var content = new Content(doc);

    spyOn(Contents, 'update');
    content.save();

    expect(Contents.update).toHaveBeenCalledWith({_id: '1'},
      { $set: {
          title: 'title',
          description: 'description',
          genre: 'RPG',
          modifiedOn: jasmine.any(Date)
        }
      });
  });
});
