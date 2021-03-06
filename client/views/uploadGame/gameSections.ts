declare var overviewTemplate: string;
overviewTemplate = `## Game Overview

### Philosophy

#### Philosophical point #1

This game is trying to do this and that.  Fundamentally I am trying to achieve something that has never been achieved before.  Or.  This game will not try and change the world.  We are ripping off the competition so exactly that I can’t believe it.  The world will be shocked at how we are using an existing engine with new art.

#### Philosophical point #2

Our game only runs on Compaq computers.  The reason for this is such and such.  We believe the world is coming to and end anyhow so what difference does it make?

#### Philosophical point #3

When you create some of these overarching philosophical points about your design, say whatever you want.  Also, feel free to change it to “My game design goals” or whatever you like to call it.

## Common Questions

### What is the game?

Describe the game is a paragraph.  This is the answer to the most common question that you will be asked.  What are you working on?

### Why create this game?

Why are you creating this game?  Do you love 3D shooters?  Do you think there is a hole in the market for Jell-O tossing midgets?

### Where does the game take place?

Describe the world that your game takes place in.  Simple as that.  Help frame it in the reader’s mind by spending a few sentences on it here.  You can go into lengthy detail later in a section solely dedicated to describing the world.  Remember that we want to keep this part of the design light and readable.

### What do I control?

Describe what the player will control.  You will be in charge of a band of rabid mutant fiddle players.  If you want you can switch on the AI and turn it into a fish bowl simulation.

### How many characters do I control?

If this applies talk a little more about the control choices.  Remember to add answers to questions that you think the reader will ask.  This is totally dependent on your design.

### What is the main focus?

Now that we know where the game takes place and what the player controls.  What are they supposed to achieve in this world?  Angry fiddle players take over the U.N. building.  Be careful not to add a bunch of salesmanship here.  Your design wants to stay light and informative.

### What’s different?

Tell them what is different from the games that are attempting this in the market right now.  This question comes up a lot.
`

declare var featureSetTemplate: string;
featureSetTemplate = `## Feature Set

### General Features

* Huge world
* Mutant fiddle players
* 3D graphics
* 32-bit color

### Multiplayer Features

* Up to 10 million players
* Easy to find a game
* Easy to find your pal in huge world
* Can chat over voice link

### Editor

* Comes with world editor
* Get levels from internet
* Editor is super easy to use

### Gameplay

* List stuff here that is key to the gameplay experience
* List a lot of stuff here
* Hey, if you got nothing here, is this game worth doing?`;

declare var gameWorldTemplate: string;
gameWorldTemplate = `## The Game World

### Overview

Provide an overview to the game world.

### World Feature #1

This section is not supposed to be called world feature #1 but is supposed to be titled with some major thing about the world.  This is where you break down what is so great about the game world into component pieces and describe each one.

### World Feature #2

Same thing here.  Don’t sell too hard.  These features should be awesome and be selling the game on its own.

### The Physical World

#### Overview

Describe an overview of the physical world.  Then start talking about the components of the physical world below in each paragraph.

The following describes the key components of the physical world.

#### Key Locations

Describe the key locations in the world here.

#### Travel

Describe how the player moves characters around in the world.

#### Scale

Describe the scale that you will use to represent the world.  Scale is important!

#### Objects

Describe the different objects that can be found in the world.

#### See the *“Objects Appendix”* for a list of all the objects found in the world.

#### Weather

Describe what sort of weather will be found in the world, if any.  Otherwise omit this section.  Add sections that apply to your game design.

#### Day and Night

Does your game have a day and night mode?  If so, describe it here.

#### Time

Describe the way time will work in your game or whatever will be used.

### Rendering System

#### Overview

Give an overview of how your game will be rendered and then go into detail in the following paragraphs.

#### 2D/3D Rendering

Describe what sort of 2D/3D rendering engine will be used.

### Camera

#### Overview

Describe the way the camera will work and then go into details if the camera is very complicated in sub sections.

#### Camera Detail #1

The camera will move around like this and that.

#### Camera Detail #2

The camera will sometimes move like this in this special circumstance.

### Game Engine

#### Overview

Describe the game engine in general.

#### Game Engine Detail #1

The game engine will keep track of everything in the world like such and such.

#### Water

There will be water in the world that looks awesome and our game engine will handle it beautifully.

#### Collision Detection

Our game engine handles collision detection really well.  It uses the such and such technique and will be quite excellent.  Can you see I am having a hard time making up stupid placeholder text here?


### Lighting Models

#### Overview

Describe the lighting model you are going to use and then go into the different aspects of it below.

#### Lighting Model Detail #1

We are using the xyz technique to light our world.

#### Lighting Model Detail #2

We won’t be lighting the eggplants in the game because they are purple.`;

declare var gamePlayTemplate: string;
gamePlayTemplate = `## The World Layout

### Overview

Provide an overview here.

### World Layout Detail #1

### World Layout Detail #2


## Game Characters

### Overview

Over of what your characters are.

### Creating a Character

How you create or personalize your character.

### Enemies and Monsters

Describe enemies or monsters in the world or whomever the player is trying to defeat.  Naturally this depends heavily on your game idea but generally games are about trying to kill something.


## User Interface

### Overview

Provide some sort of an overview to your interface and same as all the previous sections, break down the components of the UI below.

### User Interface Detail #1

### User Interface Detail #2

## Weapons

### Overview

Overview of weapons used in game.

### Weapons Details #1

### Weapons Details #2


## Musical Scores and Sound Effects

### Overview

This should probably be broken down into two sections but I think you get the point.

### Red Book Audio

If you are using Red Book then describe what your plan is here.  If not, what are you using?

### 3D Sound

Talk about what sort of sound APIs you are going to use or not use as the case may be.

### Sound Design

Take a shot at what you are going to do for sound design at this early stage.  Hey, good to let your reader know what you are thinking.`;


declare var singlePlayerGameTemplate: string;
singlePlayerGameTemplate = `## Single-Player Game

### Overview

Describe the single-player game experience in a few sentences.

Here is a breakdown of the key components of the single player game.

### Single Player Game Detail #1

### Single Player Game Detail #2

### Story

Describe your story idea here and then refer them to an appendix or separate document which provides all the details on the story if it is really big.

### Hours of Gameplay

Talk about how long the single-player game experience is supposed to last or what your thoughts are at this point.

### Victory Conditions

How does the player win the single-player game?`;

declare var multiPlayerGameTemplate: string;
multiPlayerGameTemplate = `## Multiplayer Game

### Overview

Describe how the multiplayer game will work in a few sentences and then go into details below.

### Max Players

Describe how many players can play at once or whatever.

### Servers

Is your game client-server or peer-to-peer or whatever.

### Customization

Describe how the players can customize the multiplayer experience.

### Internet

Describe how your game will work over the internet.

### Gaming Sites

Describe what gaming sites you want to support and what technology you intend to use to achieve this.  Perhaps Dplay or TCP/IP or whatever.  It is probably a good idea to break the tech stuff out into a separate area, you decide.

### Persistence

Describe if your world is persistent or not.

### Saving and Loading

Explain how you can save a multiplayer game and then reload it.  If you can or why this is not possible.
`;

declare var extrasTemplate: string;
extrasTemplate = `## Character Rendering

### Overview

Provide an overview as to how your characters will be rendered.  You may have decided to include this elsewhere or break it out to provide more detail to a specific reader.

### Character Rendering Detail #1

### Character Rendering Detail #2

## World Editing

### Overview

Provide an overview about the world editor.

### World Editing Detail #1

### World Editing Detail #2

## Extra Miscellaneous Stuff / Appendices

### Overview

Drop anything you are working on and don’t have a good home for here.

* Junk I am working on…

* Crazy idea #1

* Crazy idea #2
`;
