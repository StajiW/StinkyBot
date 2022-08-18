import { AuthError, formURL, NotFoundError, Request, UnexpectedError, User } from './util'
import Cookies from 'js-cookie'
import pkceChallenge from 'pkce-challenge'
import 'https://sdk.scdn.co/spotify-player.js'

const CLIENT_ID = '8ee6c0ac409d4020b0bd5a02e56b4c17'

export class SpotifyClient {
    private static instance: SpotifyClient
    public token:       string | null = null
    public refreshToken: string | null = null
    public expires:     number | null = null
    public userName:    string | null = null
    public loggedIn:    boolean = false
    public player:     SpotifyPlayback | null = null
    private pkceChallenge: string
    private pkceVerifier: string
    private callbacks:  { [ key: string ]: (...args: any) => void } = {}
    private updateHandle: number | null = null

    constructor() {
        const pkce = pkceChallenge()
        this.pkceChallenge = pkce.code_challenge
        this.pkceVerifier = pkce.code_verifier
    }

    public static getInstance(): SpotifyClient {
        if (!SpotifyClient.instance) {
            SpotifyClient.instance = new SpotifyClient()
        }

        return SpotifyClient.instance
    }

    public on(eventName: 'authfail', callback: () => void): void
    public on(eventName: 'login', callback: () => void): void
    public on(eventName: 'logout', callback: () => void): void
    public on(eventName: string, callback: (...args: any) => void): void {
        this.callbacks[eventName] = callback
    }

    public async setAccessToken(code: string) {
        const verifier = Cookies.get('verifier')
        if (verifier === undefined) throw 'no verifier'
        
        const res = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: 'http://localhost:5173/spotifycallback/',
                client_id: CLIENT_ID,
                code_verifier: verifier
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        const body = await res.json()
        this.updateInfo(body)
    }

    private async updateToken() {
        if (!this.loggedIn) return
        const time = new Date().getTime()
        if (this.expires! - time > 5 * 60 * 1000) return

        const res = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: this.refreshToken!,
                client_id: CLIENT_ID
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        this.validateResponse(res)

        const body = await res.json()
        this.updateInfo(body)
    }

    public async login(token: string, refreshToken: string, expires: number) {
        this.token = token
        this.refreshToken = refreshToken
        this.expires = expires
        
        this.loggedIn = true
        await this.updateToken()
        this.updateHandle = setInterval(() => this.updateToken(), 60 * 1000)

        const res = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
        const body = await res.json()
        this.userName = body.display_name
        this.player = new SpotifyPlayback()
        if (this.callbacks.login) this.callbacks.login()
    }

    public logout() {
        this.token = null
        this.refreshToken = null
        this.expires = null
        this.userName = null
        this.loggedIn = false
        Cookies.remove('spotifyToken')
        Cookies.remove('spotifyRefreshToken')
        Cookies.remove('expires')
        this.player?.disconnect()
        this.player = null
        if (this.updateHandle) clearInterval(this.updateHandle)
        if (this.callbacks.logout) this.callbacks.logout()
    }

    public getAuthURL() {
        return formURL('https://accounts.spotify.com/authorize', {
            client_id: CLIENT_ID,
            response_type: 'code',
            redirect_uri: 'http://localhost:5173/spotifycallback/',
            scope: 'user-read-email user-read-private streaming user-modify-playback-state ',
            code_challenge_method: 'S256',
            code_challenge: this.pkceChallenge
        })
    }

    public followLink(event: MouseEvent) {
        event.preventDefault()

        Cookies.set('verifier', this.pkceVerifier)

        window.location.href = this.getAuthURL()
    }

    private updateInfo(body: any) {
        this.token = body.access_token
        this.refreshToken = body.refresh_token
        this.expires = new Date().getTime() + body.expires_in * 1000
        Cookies.set('spotifyToken', this.token!)
        Cookies.set('spotifyRefreshToken', this.refreshToken!)
        Cookies.set('expires', this.expires!.toString())
    }

    public async validateResponse(res: any) {
        switch (res.status) {
            case 200:
            case 202:
            case 204:
                return
            case 401:
                this.logout()
                if (this.callbacks.authfail) this.callbacks.authfail()
                throw new AuthError()
            default:
                throw new UnexpectedError()
        }
    }

    public async findSong(query: string): Promise<any> {
        if (!this.loggedIn) throw new AuthError()

        const url = formURL('https://api.spotify.com/v1/search', {
            q: query,
            type: 'track',
            limit: '1'
        })

        const res = await fetch(url, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`
            }
        })

        this.validateResponse(res)

        const body = await res.json()
        if (body.tracks.items.length < 1) throw new NotFoundError()
        return body.tracks.items[0]
    }
}

export class SpotifyPlayback {
    player: Spotify.Player
    id: string | null = null
    ready: boolean = false
    private callbacks:  { [ key: string ]: (...args: any) => void } = {}

    constructor() {
        this.player = new Spotify.Player({
            name: 'StinkyBot',
            getOAuthToken: callback => {
                const client = SpotifyClient.getInstance()
                if (!client.loggedIn) this.disconnect()
                callback(client.token!)
            }
        })
    
        this.player.connect()
        // @ts-ignore
        this.player.addListener('ready', ({ device_id }) => {
            this.ready = true
            this.id = device_id
            if (this.callbacks.ready) this.callbacks.ready()
        })
    
        // this.player.addListener('player_state_changed', (res: Spotify.PlaybackState) => {
        //     if (this.callbacks.stateChange) this.callbacks.stateChange(res)
        // })
    }

    public on(eventName: 'ready', callback: () => void): void
    public on(eventName: string, callback: (...args: any) => void): void {
        this.callbacks[eventName] = callback
    }

    public disconnect() {
        this.player.disconnect()
    }

    // public onStateChange(res: Spotify.PlaybackState) {
    //     if (this.request === null) return

    //     if (res.track_window.current_track.id !== this.request.id) {
    //         this.playing = false
    //     }
    // }

    // public async set(request: SpotifyRequest) {
    //     this.playing = true
    //     this.position = 0
    //     this.request = request

    //     await this.playSong(request.id)
    // }

    public async playSong(id: string, position: number = 0) {
        const client = SpotifyClient.getInstance()

        if (!client.loggedIn) throw new AuthError()
        if (this.player === null) throw new UnexpectedError()

        const res = await fetch(formURL('https://api.spotify.com/v1/me/player/play', { device_id: this.id! }), {
            method: 'PUT',
            body: JSON.stringify({
                uris: [ `spotify:track:${id}` ],
                position_ms: position
            }),
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${client.token}`,
                'Content-Type': 'application/json'
            }
        })

        client.validateResponse(res)
    }
}

export class SpotifyRequest extends Request {
    artist: string
    songName: string
    albumName: string
    albumCover: string
    year: string

    constructor(title: string, requestedBy: User, length: number, id: string, 
                artist: string, songName: string, albumName: string, albumCover: string, year: string) {
        super(title, requestedBy, length, id)
        this.artist = artist
        this.songName = songName
        this.albumName = albumName
        this.albumCover = albumCover
        this.year = year
    }

    static async fromQuery(query: string, user: User): Promise<SpotifyRequest> {
        const client = SpotifyClient.getInstance()
        const song = await client.findSong(query)

        const name = `${song.artists[0].name} - ${song.name}`
        const length = song.duration_ms / 1000
        const year = SpotifyRequest.getYear(song.album.release_date)

        return new SpotifyRequest(name, user, length, song.id, song.artists[0].name, song.name, song.album.name, song.album.images[0].url, year)
    }

    static getYear(releaseDate: string): string {
        return releaseDate.split('-')[0]
    }
}