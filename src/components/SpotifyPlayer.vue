<script setup lang='ts'>
import { SpotifyClient, SpotifyRequest } from '../scripts/spotify'
import { onMounted, PropType, ref, watch } from 'vue'
import ColorThief from 'colorthief'
import ContrastChecker from 'color-contrast-checker'
const spotifyClient = SpotifyClient.getInstance()
const colorThief = new ColorThief()
const contrastChecker = new ContrastChecker()

const POLL_RATE = 500

const playing = ref(true)
const position = ref(0)
const coverRef = ref()
const timelineRef = ref()
const backgroundColor = ref('#000000')
let inSong = true
let seeking = false
let skipped = false

const props = defineProps({
    request: {
        type: Object as PropType<SpotifyRequest>,
        required: true
    },
    skipped: {
        type: Boolean,
        required: true
    }
})

onMounted(() => {
    if (spotifyClient.player === null) return
    if (skipped) return

    if (spotifyClient.player.ready) {
        spotifyClient.player!.playSong(props.request.id)
        setInterval(() => update(), POLL_RATE)
    }
    else spotifyClient.player.on('ready', () => {
        if (skipped) return
        spotifyClient.player!.playSong(props.request.id)
        play()
        setInterval(() => update(), POLL_RATE)
    })
})

async function update() {
    if (spotifyClient.player === null) return
    const state = await spotifyClient.player.player.getCurrentState()
    if (state === null) return
    if (!isValid(state)) {
        if (inSong) {
            inSong = false
            pause()
        }
        return
    }

    if (!seeking) position.value = state.position / state.duration
    if (state.paused) pause()
    else play()
}

function isValid(state: Spotify.PlaybackState): boolean {
    if (skipped) return true

    // @ts-ignore
    if (state.playback_id === '') return false
    if (state.context.metadata.current_item.uri !== `spotify:track:${props.request.id}`) return false

    return true
}
 
function setColors() {
    const colors: number[][] = colorThief.getPalette(coverRef.value, 4)

    for (let color of colors) {
        const hex = rgbToHex(color)
        if (contrastChecker.isLevelAA(hex, '#FFFFFF', 20)) {
            backgroundColor.value = hex
            return
        }
    }
}

function rgbToHex(rgb: number[]) {
  return "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
}

function componentToHex(c: number): string {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function play() {
    if (playing.value === true) return
    if (!inSong) {
        spotifyClient.player!.playSong(props.request.id, getTime())
    }
    else {
        spotifyClient.player?.player.resume()
    }
    playing.value = true
    inSong = true
}

function pause() {
    if (playing.value === false) return
    if (inSong) spotifyClient.player?.player.pause()
    playing.value = false
}

function getTime() {
    return props.request.length * position.value * 1000
}

function onClick(e: MouseEvent) {
    seeking = true
    updatePosition(e)
}

function updatePosition(e: MouseEvent) {
    const target = timelineRef.value as HTMLElement
    const bounds = target.getBoundingClientRect()

    let pos = (e.clientX - bounds.left) / target.clientWidth
    if (pos < 0) pos = 0
    else if (pos > 1) pos = 1
    position.value = pos
}

window.addEventListener('mousemove', (e: MouseEvent) => {
    if (!seeking) return

    updatePosition(e)
})

window.addEventListener('mouseup', (e: MouseEvent) => {
    if (!seeking) return

    if (inSong) spotifyClient.player?.player.seek(getTime())
    seeking = false
})

watch(() => props.skipped, () => {
    skipped = true
})
</script>

<template>
<div id='spotifyPlayer' :style='{ backgroundColor: backgroundColor }'>
    <div id='container'>
        <img id='albumCover' ref='coverRef' crossorigin='anonymous' :src='request.albumCover' draggable='false' @load='() => setColors()'/>
        <img id='play' src='../assets/play.svg' :class='{ InActive: playing }' draggable='false' @click='() => play()' />
        <img id='pause' src='../assets/pause.svg' :class='{ InActive: !playing }' draggable='false' @click='() => pause()' />
        <!-- <img id='skip' src='../assets/skip.svg' draggable='false' @click='() => skip()' /> -->

        <div id='timeline' @mousedown='(e: MouseEvent) => onClick(e)' ref='timelineRef'>
            <div id='progress' :style='{ width: `${position * 100}%` }' />
        </div>

        <div id='info'>
            <div id='artist'>{{ request.artist }}</div>
            <div id='song'>{{ request.songName }}</div>
            <div id='album'>{{ request.albumName }} ({{ request.year }})</div>
        </div>
    </div>
</div>
</template>

<style scoped>
#spotifyPlayer {
    position: absolute;
    width: 100%;
    height: 100%;
    /* background-color: blue; */

    user-select: none;
}

#container {
    --margin: 6%;
    position: absolute;
    width: calc(100% - 2 * var(--margin));
    height: calc(100% - (2 * var(--margin) * 16 / 9));
    margin: var(--margin);
    /* background-color: green; */
}

img {
    user-select: none;
}

#info {
    position: absolute;
    top: 0;
    left: 0;
    width: 52.5%;
    height: 70%;
    color: white;
    overflow: hidden;
}

#info > div {
    margin-bottom: 1rem;
    /* overflow: hidden; */
    /* white-space: nowrap; */
    /* text-overflow: ellipsis; */
}

#artist {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    font-size: 3rem;
}

#song, #album {
    font-size: 1.5rem;
}

#albumCover {
    position: absolute;
    top: 0;
    right: 0;
    height: 80%;
}

#play, #pause {
    position: absolute;
    bottom: 0;
    width: 10%;

    filter: invert(100%);

    cursor: pointer;
}

#play.InActive,#pause.InActive {
    opacity: 0;
    pointer-events: none;
}

#skip {
    position: absolute;
    bottom: 0;
    left: 12.5%;
    width: 7.5%;

    filter: invert(100%);
}

#timeline {
    position: absolute;
    height: 2%;
    width: 85%;
    bottom: 0;
    right: 0;

    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 10000px;

    overflow: hidden;
    cursor: pointer;
}

#progress {
    position: absolute;
    height: 100%;

    background-color: white;

    transition-property: width;
    transition-duration: .05s;
}
</style>