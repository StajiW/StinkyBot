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

let requestCounter = 0

export class Request {
    type: RequestType = 0
    title: string
    requestedBy: User
    length: number
    id: string
    index: number

    constructor(title: string, requestedBy: User, length: number, id: string) {
        this.title = title,
        this.requestedBy = requestedBy,
        this.length = length
        this.id = id
        this.index = requestCounter++
    }
}

export enum ErrorCode {
    Auth,
    NotFound,
    Input,
    Unexpected
}

export class BaseError extends Error {
    code: ErrorCode

    constructor(code: ErrorCode, message?: string) {
        super(message)
        this.code = code
    }
}

export class AuthError extends BaseError {
    constructor() {
        super(ErrorCode.Auth)
    }
}

export class NotFoundError extends BaseError {
    constructor() {
        super(ErrorCode.NotFound)
    }
}

export class InputError extends BaseError {
    constructor() {
        super(ErrorCode.Input)
    }
}

export class UnexpectedError extends BaseError {
    constructor() {
        super(ErrorCode.Unexpected)
    }
}