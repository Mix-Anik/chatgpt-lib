# chatgpt-lib
![npm](https://img.shields.io/npm/v/chatgpt-lib)
![npm](https://img.shields.io/npm/dw/chatgpt-lib)
![GitHub](https://img.shields.io/github/license/Mix-Anik/chatgpt-lib)

Simple javascript wrapper for ChatGPT's unofficial web API

## Installation
`npm i chatgpt-lib`

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
const cgpt = require('chatgpt-lib');
const config = require('./config');

...

const chatbot = new cgpt.ChatGPT(config);
let answer = await chatbot.ask("Hey, how are you doing today?");
console.log(answer);
answer = await chatbot.ask("Can you explain to me how quantum superposition works?");
console.log(answer);
```
You can also start conversation just like on the ChatGPT's web page, but in CLI mode:
```js
// index.js contents

const cgpt = require('chatgpt-lib');
const config = require('./config');

const chatbot = new cgpt.ChatGPT(config);
chatbot.initCliConversation();
```
Then just run in like `node index.js`

![image](https://user-images.githubusercontent.com/36076591/206302699-9215f570-ca60-4dc9-b89a-6874b87caa74.png)

## Docs
| Class   |         Method          |                      Params | Description                      |
|---------|:-----------------------:|----------------------------:|----------------------------------|
| ChatGPT |      `ask(prompt)`      |     _prompt_ : text to send | Prompts ChatGPT with given text  |
| ChatGPT |     `resetThread()`     |                           - | Resets conversation with ChatGPT |
| ChatGPT | `validateToken(token)`  | _token_ : token to validate | Checks if jwt has expired        |
| ChatGPT |      `getTokens()`      |                           - | Fetches auth and session tokens  |
| ChatGPT | `initCliConversation()` |                           - | Starts conversation in CLI mode  |

## Credits
Inspired by python version - https://github.com/acheong08/ChatGPT  
ChatGPT for creating model - https://chat.openai.com/chat  

funny fact, initial code was written by giving and asking ChatGPT to rewrite python version in javascript
