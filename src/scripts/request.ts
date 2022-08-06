export enum RequestType {
    Spotify,
    Youtube,
    SoundCloud
}

export class Request {
    type: RequestType = 0
    title: string
    requestedBy: string
    length: number
    id: string
    color: string

    constructor(title: string, requestedBy: string, length: number, id: string, color: string) {
        this.title = title,
        this.requestedBy = requestedBy,
        this.length = length
        this.id = id
        this.color = color
    }
}