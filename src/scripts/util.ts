export function formURL(base: string, searchParams: { [ key: string ]: string }): string {
    const url = new URL(base)

    for (let key in searchParams) {
        url.searchParams.append(key, searchParams[key])
    }

    return url.href
}

export function deepCopy(obj: Object): Object {
    return JSON.parse(JSON.stringify(obj))
}

export type User = {
    name: string,
    id: number,
    color: string
}

export enum RequestType {
    Spotify,
    Youtube,
    SoundCloud
}

export class Request {
    type: RequestType = 0
    title: string
    requestedBy: User
    length: number
    id: string

    constructor(title: string, requestedBy: User, length: number, id: string) {
        this.title = title,
        this.requestedBy = requestedBy,
        this.length = length
        this.id = id
    }
}