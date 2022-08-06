import { formURL } from './util'

const CLIENT_ID = '8ee6c0ac409d4020b0bd5a02e56b4c17'

export function getSpotifyAuthURL() {
    return formURL('https://accounts.spotify.com/authorize', {
        client_id: CLIENT_ID,
        response_type: 'token',
        redirect_uri: 'http://localhost:5173/spotifycallback/',
        scope: 'playlist-read-private user-modify-playback-state'
    })
}

export class Spotify {
    
}