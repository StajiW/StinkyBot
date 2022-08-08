import { formURL } from './util'
import Cookies from 'js-cookie'
import pkceChallenge from 'pkce-challenge'

const CLIENT_ID = '8ee6c0ac409d4020b0bd5a02e56b4c17'

export default class SpotifyClient {
    private static instance: SpotifyClient
    public token: string | null = null
    public refreshToken: string | null = null
    public expires: number | null = null
    public userName: string | null = null
    public loggedIn: boolean = false
    private pkceChallenge: string
    private pkceVerifier: string

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

    public async login(token: string, refreshToken: string, expires: number) {
        this.token = token
        this.refreshToken = refreshToken
        this.expires = expires

        const res = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
        const body = await res.json()
        this.userName = body.display_name

        this.updateToken()
        setInterval(() => this.updateToken(), 60 * 1000)

        this.loggedIn = true
    }

    getAuthURL() {
        return formURL('https://accounts.spotify.com/authorize', {
            client_id: CLIENT_ID,
            response_type: 'code',
            redirect_uri: 'http://localhost:5173/spotifycallback/',
            scope: 'playlist-read-private user-modify-playback-state',
            code_challenge_method: 'S256',
            code_challenge: this.pkceChallenge
        })
    }

    followLink(event: MouseEvent) {
        event.preventDefault()

        Cookies.set('verifier', this.pkceVerifier)

        window.location.href = this.getAuthURL()
    }

    static async getAccessToken(code: string) {
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

        return await res.json()
    }

    async updateToken() {
        if (!this.loggedIn) return
        const time = new Date().getTime()
        if (time - this.expires! > 5 * 60 * 1000) return

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

        const body = await res.json()
    }

    async searchSong(query: string) {
        
    }
}