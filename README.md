# Bolt
## Is a discord bot!

Bolt comes with a wide range of features, and is built with the intention of being as modular as possible!

To accomplish this, an event and command handler had to be built into the bot, allowing the possibility of adding your own commands and message events to be tracked. 

# Contributing

Feel free to contribute to the project! The `feature` branch is meant for contributions! If you have a command or an event you would like to add to the bot, this is where you add it.

## Rules
In order to contribute to the project, you must first make sure all of the bellow points are applicable to your code

* Understandable and readable code.
* camelCaseCode.
* No tokens are available in the code.
* Messages sent by the bot must be PG. This is a moderation bot after all

# The config

Make sure to create a `condif.json` file in the bot directory. This is where you will keep your token and test guilds. The config file should be structured like this:
```json
{
    "token": "Your-token-here",
    "prefix": "$",
    "ownerID": "Your ID here",
    "testGuilds": ["Guild-ID","Another-Guild-ID"]
}
```

The prefix is what the bot will default to, when joining a new guild, but this can be changed by an administrator of the guild.

To make this easier, rename the `config_example.json` to `config.json` and fill in each field as instructed. 

# Adding your own commands

In order to add your own commands to the bot, you must create a new javascript file in the `commands` folder, and name it what you want your command to be. This file needs to be structured like this:
```js
const client = require("../app");
// Other constants go here

module.exports.run = async (message) => {

    // Your code here

}

// Other functions bellow
function name(param) {
    // Code
}
```

# Adding your own events

To add your own events to the bot, it is the same as with bots, except this time the events require a trigger instead of run.
```js
const client = require("../app");
// Other constants go here

module.exports.trigger = async (message) => {

    // Your code here

}

// Other functions bellow
function name(param) {
    // Code
}
```

