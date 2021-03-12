<center>
    <img src='https://nodei.co/npm/@zs_master1/simple-djs.png'>
</center>

# Installation
```
npm install @zs_master1/simple-djs
```

# Usage
#### Main file
```js
const simple_djs = require('@zs_master1/simple-djs');

new simple_djs('Your bots token here')
.setCommandsDir('cmds') //defaults to 'commands'
.setFeaturesDir('features') //optional
.load() //Loads the commands
```

#### A command file
```js
module.exports = {
    aliases: ['ping', 'test'],
    description: '',
    allowDMs: true, //defaults to false
    allowGuilds: true, //defaults to true
    slashCommand: true, //defaults to false
    arguments: [
        {
            name: 'argument',
            description: 'This is an argument',
            type: 3,
            required: false, //defaults to true
        }
    ],
    execute: (client, message, args) => {
        //do something
    }
}
```
Command argument types can be found at [Discord Docs](https://discord.com/developers/docs/interactions/slash-commands#applicationcommandoptiontype)

#### A feature file
```js
module.exports = (client) => {
    //do something
}
```