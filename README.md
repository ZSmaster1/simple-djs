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
    allowDMs: true,
    allowGuilds: true,
    arguments: [
        {
            name: 'argument',
            description: 'This is an argument',
            type: 3,
        }
    ],
    execute: (client, message, args) => {
        //do something
    }
}
```

#### A feature file
```js
module.exports = (client) => {
    //do something
}
```