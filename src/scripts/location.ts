import { formURL } from './util'

export async function getLocation() {
    const res = await fetch('http://ip-api.com/json')
    const body = await res.json()
    console.log(body)
}