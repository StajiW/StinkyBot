import { RequestType } from './request'

export type Settings = {
    spotify: boolean,
    youtube: boolean,
    soundcloud: boolean,
    maxDuration: number,
    maxRequests: number,
    connectedChannel: string,
    default: RequestType
}

export const defaultSettings: Settings = {
    spotify: true,
    youtube: true,
    soundcloud: true,
    maxDuration: 600,
    maxRequests: 1,
    connectedChannel: '',
    default: RequestType.Spotify
}