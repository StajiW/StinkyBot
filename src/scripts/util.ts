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
