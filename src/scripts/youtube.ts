// import { Request, RequestType } from './request'
import { Request, RequestType, formURL, User } from './util'
import moment from 'moment'

const API_KEY = 'AIzaSyC4fYJlSpH7L3x5Z5iaj_eE--JGMCrgis0'

export class YoutubeRequest extends Request {
    type: RequestType = RequestType.Youtube

    static getIDFromURL(url: string): string {
        const params = new URL(url).searchParams
        const id = params.get('v')
        if (id === null) throw 'invalid url'
        return id
    }

    static async getVideo(id: string) {
        const url = formURL('https://youtube.googleapis.com/youtube/v3/videos', {
            part: 'contentDetails,snippet,player',
            id: id,
            key: API_KEY
        })

        const res = await fetch(url)

        const body = await res.json()
        
        if (!body.items || body.items.length < 1) throw 'video not found'

        return body.items[0]
    }

    static async fromURL(url: string, user: User): Promise<YoutubeRequest> {
        const id = YoutubeRequest.getIDFromURL(url)
        const video = await YoutubeRequest.getVideo(id)
        const duration = moment.duration(video.contentDetails.duration)

        let title
        if (video.snippet.channelTitle.match(/.+ - Topic$/)) {
            title = `${video.snippet.channelTitle.replace(/ - Topic$/, '')} - ${video.snippet.title}`
        }
        else title = video.snippet.title

        return new YoutubeRequest(
            title,
            user,
            duration.asSeconds(),
            video.id
        )
    }
}

