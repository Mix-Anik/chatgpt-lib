const uuid = require('uuid');
const axios = require('axios');
const cliPrompt = require('prompt-sync')();

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36';

function isValidJson(text) {
    try{
        JSON.parse(text);
        return true;
    } catch {
        return false;
    }
}

class ChatGPT {
    constructor(config, conversationId = null) {
        this.config = config;
        this.conversationId = conversationId;
        this.parentId = uuid.v4();
    }

    async ask(prompt) {
        if (!this.config.Authorization || !this.validateToken(this.config.Authorization))
            await this.getTokens();

        let response = await axios.request({
            method: 'POST',
            url: 'https://chat.openai.com/backend-api/conversation',
            data: {
                action: 'next',
                messages: [
                    {
                        id: uuid.v4(),
                        role: 'user',
                        content: {
                            content_type: 'text',
                            parts: [prompt],
                        },
                    },
                ],
                model: 'text-davinci-002-render',
                conversation_id: this.conversationId,
                parent_message_id: this.parentId,
            },
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'text/event-stream;application/json',
                'Authorization': `Bearer ${this.config.Authorization}`,
                'Content-Type': 'application/json',
            }
        }).catch(err => {
            if (err.response.status.toString()[0] === '5')
                return 'ChatGPT failed to respond due to internal error. Please try again.';

            console.log(`ERROR: ChatGPT failed to respond due to :${err}`);
            return 'ChatGPT failed to respond. Possibly because "chatgpt-lib" flow broke, please report to the developer.';
        });

        response = response.data.split('\n\n');
        response = response[response.length-3].slice(6);

        try {
            if (isValidJson(response))
                response = JSON.parse(response);
            else
                return 'ChatGPT failed to respond. Please try again.';

            this.parentId = response.message.id;
            this.conversationId = response.conversation_id;

            return response.message.content.parts[0];
        } catch (err) {
            console.log(`ERROR: Could not find or parse actual response text due to: ${err}`);
            return 'ChatGPT failed to respond. Please try again.';
        }
    }

    resetThread() {
        this.conversationId = null;
        this.parentId = uuid.v4();
    }

    validateToken(token) {
        if (!token) return false;
        const parsed = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

        return Date.now() <= parsed.exp * 1000;
    }

    async getTokens() {
        if (!this.config.hasOwnProperty('SessionToken')) {
            throw new Error('No session token provided');
        }

        const response = await axios.request({
            method: 'GET',
            url: 'https://chat.openai.com/api/auth/session',
            headers: {
                'User-Agent': USER_AGENT,
                'Cookie': `__Secure-next-auth.session-token=${this.config.SessionToken}`
            }
        });

        try {
            const cookies = response.headers['set-cookie'];
            const sessionCookie = cookies.find(cookie => cookie.startsWith('__Secure-next-auth.session-token'));

            this.config.SessionToken = sessionCookie.split('=')[1];
            this.config.Authorization = response.data.accessToken;
        } catch (err) {
            throw new Error(`Failed to fetch new session tokens due to: ${err}`);
        }
    }

    async initCliConversation() {
        console.log('You can start prompting ChatGPT now.\nIf you want to reset thread type "\\r". To exit type "\\q" or press ctrl+c.');
        while (true) {
            const input = cliPrompt('You: ');

            if (['\\q', null].includes(input)) break;
            if (input === '\\r') {
                this.resetThread();
                console.log('Thread was reset.');
                continue;
            }

            const answer = await this.ask(input);
            console.log(`ChatGPT: ${answer}`);
        }
    }
}

module.exports = {
    ChatGPT
};
