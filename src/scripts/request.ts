import { User } from './util'
import { YoutubeRequest } from './youtube'

const urlRegex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/

export async function getRequestFromMessage(message: string, user: User) {
    const words = message.split(' ')
    const url = getURLFromWord(words[0])
    if (url === null) {
        // return SpotifyRequest.fromQuery(message)
        return
    }
    
    switch (url.host) {
        case 'www.youtube.com':
        case 'www.youtube.be':
            return YoutubeRequest.fromURL(url.href, user)
        //     break
        // case 'www.soundcloud.com':
        //     return SoundCloudRequest.fromURL(url)
        //     break
        // case 'open.spotify.com':
        //     return SpotifyRequest.fromURL(url)
        //     break
        // default:
        //     return SpotifyRequest.fromURL(url)

    }
}

export function getURLFromWord(word: string): URL | null {
    const res = urlRegex.exec(word)

    if (res !== null) {
        let href = res[0]
        if (!href.startsWith('www.') && !href.startsWith('open.')) href = 'www.' + href
        href = 'https://' + href
        
        try {
            return new URL(href)
        } catch {}
    }

    return null
}