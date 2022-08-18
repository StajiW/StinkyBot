<script setup lang='ts'>
import { PropType, ref, reactive, watch } from 'vue'
import { SpotifyRequest, SpotifyClient } from '../scripts/spotify'
import { YoutubeRequest } from '../scripts/youtube'
import { Request, RequestType } from '../scripts/util'
import SpotifyPlayer from './SpotifyPlayer.vue'
import YoutubePlayer from './YoutubePlayer.vue'

const spotifyClient = SpotifyClient.getInstance()

const props = defineProps({
    request: {
        type: Object as PropType<Request>,
        required: false
    }
})
const emit = defineEmits([ 'next' ])

const started = ref(false)
const spotifySkipTrigger = ref(false)
const players = reactive<Request[]>([])

watch(() => props.request, () => {
    if (props.request !== undefined) {
        spotifySkipTrigger.value = !spotifySkipTrigger.value

        players.push(props.request)

        setTimeout(() => {
            if (players[0]?.type === RequestType.Spotify && props.request?.type !== RequestType.Spotify) {
                spotifyClient.player?.player.pause()
            }
            if (players.length > 1) players.shift()
        }, 1100)
    }
})
</script>

<template>
<div id='player'>
    <div id='activate' v-if='!started' @click='started = true'><div>Click to enable player</div></div>
    <!-- <div id='iFrame' v-if='request && started'>
        <iframe v-if='request.type === RequestType.Youtube' ref='youtubeRef' id='video' width="1920" height="1080"
        :src='`https://www.youtube.com/embed/${request.id}?autoplay=1&showinfo=0&enablejsapi=1&rel=0`' title="YouTube video player" frameborder="0">
        </iframe>
    </div> -->
    <div id='container' v-if='request && started' v-for='request in players' :key='request.index.toString()'>
        <SpotifyPlayer v-if='request?.type === RequestType.Spotify' :request='(request as SpotifyRequest)' :skipped='spotifySkipTrigger' />
        <YoutubePlayer v-if='request?.type === RequestType.Youtube' :request='(request as YoutubeRequest)' />
    </div>
</div>
</template>

<style scoped>
#player {
    position: relative;
    width: 100%;
    padding-bottom: calc(9 / 16 * 100%);
    background-color: black;
}

#activate {
    position: absolute;
    width: 100%;
    height: 100%;
}

#activate > div {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    
    font-size: 2rem;
    font-weight: 600;
    text-align: center;
    color: white;

    user-select: none;
}

#container {
    position: absolute;
    width: 100%;
    height: 100%;

    animation-name: appear;
    animation-duration: 1s;

    background-color: black;
}

@keyframes appear {
    0% { clip-path: inset(0 100% 0 0); }
    100% { clip-path: inset(0 0 0 0); }
}

#iFrame {
    position: absolute;
    width: 100%;
    height: 100%;
}

iframe {
    width: 100% !important;
    height: 100% !important;
}

/* #play {
    width: 6rem;
    height: 6rem;
    background-image: url('../assets/play.svg');
    background-size: cover;
    cursor: pointer;
    transition-property: opacity;
    transition-duration: .2s;
}
#play.InActive {
    opacity: 0;
    pointer-events: none;
}

#pause {
    width: 6rem;
    height: 6rem;
    background-image: url('../assets/pause.svg');
    background-size: cover;
    cursor: pointer;
    transition-property: opacity;
    transition-duration: .2s;
}
#pause.InActive {
    opacity: 0;
    pointer-events: none;
} */

#skip {
    position: absolute;
    top: 50%;
    left: 65%;
    transform: translate(-50%, -50%);
    width: 3rem;
    height: 3rem;

    background-image: url('../assets/skip.svg');
    background-size: cover;
    cursor: pointer;
}
</style>