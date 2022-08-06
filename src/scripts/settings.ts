import { RequestType } from './request'

export type Settings = {
    spotify: boolean,
    youtube: boolean,
    soundCloud: boolean,
    maxDuration: number,
    maxRequests: number,
    connectedChannel: string,
    default: RequestType
    fallback: string
}

export const defaultSettings: Settings = {
    spotify: false,
    youtube: true,
    soundCloud: true,
    maxDuration: 10,
    maxRequests: 1,
    connectedChannel: 'StajiW',
    default: RequestType.Spotify,
    fallback: ''
}