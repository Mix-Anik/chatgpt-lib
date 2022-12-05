# chat-gpt
Simple javascript wrapper for ChatGPT's unofficial web API

## Installation
`npm i chat-gpt`

## Setup & Usage
1. You will need session token for this to work.  
To obtain it:
   - go to https://chat.openai.com/chat and login
   - press F12 to open browser devtools and go to `Application` tab
   - find `Cookies` in `Storage` section, open them up and click on `https://chat.openai.com`
   - find cookie with name `__Secure-next-auth.session-token` and copy its value
2. Create file `config.json` and paste your session token as `SessionToken` key value:
```json
{
  "SessionToken": "<insert-your-session-token-here>"
}
```
3. Here's minimal code for prompting a question to chatGPT
```js
const cgpt = require('chat-gpt');
const config = require('./config');

const chatbot = new cgpt.ChatGPT(config);
chatbot.ask("Hey, how are you doing today?").then(answer => {
    console.log(answer);
})
```

## Credits
Inspired by python version - https://github.com/acheong08/ChatGPT  
ChatGPT for creating model - https://chat.openai.com/chat  

funny fact, initial code was written by giving and asking ChatGPT to rewrite python version in javascript
