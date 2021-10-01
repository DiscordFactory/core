# 🌲 Environment

The environment file has an extremely important place in the framework, in fact you can have two different environments, one for development and the other for production.
Each of these two environments is represented by a file on your disk, at the root of your project and can take the exetensions `json` or `yaml`.

## Development
This mode is used when you are designing your application, it is called `environment.dev.(json|yaml)`

The structure of the file will be detailed below.

## Production
This mode is used when you are designing your application, it is called `environment.prod.(json|yaml)`

The structure of the file will be detailed below.

## Structure minimale
Whatever extension of your environment you choose, you must respect the following interface
```ts
type Json = { [K in string]: string }

interface environment {
  APP_TOKEN: string
  PARTIALS: string[]
  INTENTS: string[]
  MY_CUSTOM_KEY: string | string[] | Json
}
```

### If you have chosen YAML
###### environment.(dev|prod).yaml
```yaml
APP_TOKEN: Your token here
PARTIALS:
  - MESSAGE
  - CHANNEL
  - REACTION
INTENTS:
  - GUILDS
  - GUILD_MEMBERS
  - GUILD_BANS
  - GUILD_EMOJIS_AND_STICKERS
  - GUILD_INTEGRATIONS
  - GUILD_WEBHOOKS
  - GUILD_INVITES
  - GUILD_VOICE_STATES
  - GUILD_PRESENCES
  - GUILD_MESSAGES
  - GUILD_MESSAGE_REACTIONS
  - GUILD_MESSAGE_TYPING
  - DIRECT_MESSAGES
  - DIRECT_MESSAGE_REACTIONS
  - DIRECT_MESSAGE_TYPING

# Other settings..
```

### If you have chosen JSON
###### environment.(dev|prod).json
```json
{
  "APP_TOKEN": "Your token here",
  "PARTIALS": ["MESSAGE" , "CHANNEL", "REACTION"],
  "INTENTS": [
    "GUILDS",
    "GUILD_MEMBERS",
    "GUILD_BANS",
    "GUILD_EMOJIS_AND_STICKERS",
    "GUILD_INTEGRATIONS",
    "GUILD_WEBHOOKS",
    "GUILD_INVITES",
    "GUILD_VOICE_STATES",
    "GUILD_PRESENCES",
    "GUILD_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
    "GUILD_MESSAGE_TYPING",
    "DIRECT_MESSAGES",
    "DIRECT_MESSAGE_REACTIONS",
    "DIRECT_MESSAGE_TYPING"
  ]
  //Other settings..
}
```