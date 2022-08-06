import * as tmi from 'tmi.js'
import { formURL, User } from './util'

const CLIENT_ID = 'lev91p9tnewrt26f03nz3d9muaefz5'

export function getTwitchAuthURL(): string {
	return formURL('https://id.twitch.tv/oauth2/authorize', {
		client_id: CLIENT_ID,
		redirect_uri: 'http://localhost:5173/twitchcallback/',
		response_type: 'token',
		scope: 'chat:read chat:edit'
	})
}

export class ChatBot {
    client: tmi.Client | null = null
    accessToken: string
    userName: string
    callbacks: { [ key: string ]: (...args: any) => void } = {}
    channel: string | null = null

    constructor(accessToken: string, userName: string) {
        this.accessToken = accessToken
        this.userName = userName
    }

    static async login(accessToken: string): Promise<ChatBot> {
        const res = await fetch('https://api.twitch.tv/helix/users', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Client-Id': CLIENT_ID
            }
        })

        const body = await res.json()
        const name = body.data[0].display_name

        return new ChatBot(accessToken, name)
    }

    connect(channel: string) {
        this.channel = channel
        this.client = new tmi.Client({
            identity: {
                username: this.userName,
                password: `oauth:${this.accessToken}`
            },
            channels: [ channel ]
        })

        this.client.connect()

        this.client.on('message', (channel: string, tags: tmi.ChatUserstate, message: string, self: boolean) =>
            this.handleMessage(channel, tags, message, self)
        )
    }

    on(eventName: 'request', callback: (user: User, request: string) => void): void
    on(eventName: 'start', callback: () => void): void
    on(eventName: 'stop', callback: () => void): void

    on(eventName: string, callback: (...args: any) => void): void {
        this.callbacks[eventName] = callback
    }

    handleMessage(channel: string, tags: tmi.ChatUserstate, message: string, self: boolean) {
        if (self) return
        if (!message.startsWith('!')) return

        console.log(tags)

        const user: User = {
            name: tags['display-name']!,
            id: parseInt(tags['user-id']!),
            color: tags['color']!
        }

        const command = /^![^ ]*/.exec(message)![0].slice(1)
        const res = /\s([\W\w\s]*)\s*/.exec(message)
        const params = (res === null) ? null : res[res.length - 1]

        switch (command) {
            case 'sr2':
                if (params === null) this.say('Usage: !sr <link or "band name - song title">')
                else if (this.callbacks.request) this.callbacks.request(user, params)
            default:
        }
    }

    say(message: string) {
        if (!this.client) return
        if (!this.channel) return
        this.client.say(this.channel, message)
    }
}