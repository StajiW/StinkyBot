<script setup lang='ts'>
import { onMounted, PropType } from 'vue'
import { Request } from '../scripts/util.js'
const props = defineProps({
    requests: {
        type: Array as PropType<Request[]>,
        required: true
    },
    current: {
        type: Object as PropType<Request>
    }
})

const emit = defineEmits([ 'skip' ])

const iconClasses = {
    0: 'Spotify',
    1: 'Youtube',
    2: 'SoundCloud'
}

function getLengthString(length: number) {
    const hours = Math.floor(length / 3600)
    const minutes = Math.floor((length % 3600) / 60)
    const seconds = Math.floor(length - minutes * 60)

    if (hours) return `${hours}:${fixedZero(minutes)}:${fixedZero(seconds)}`
    return `${fixedZero(minutes)}:${fixedZero(seconds)}`
}

function fixedZero(num: number) {
    if (num >= 10) return num.toString()
    return '0' + num.toString()
}

function skip() {
    emit('skip')
}
</script>

<template>
<div id='requests'>
    <!-- <div class='NowPlaying' v-if='current'>Now Playing:</div> -->
    <TransitionGroup name='transitionGroup'>
        <div class='Request Current' v-if='current' :key='current.index.toString()'>
            <div class='Left'>
                <div class='Info'>
                    <div class='Title'>{{ current.title }}</div>
                    <div class='Bottom'>
                        <div class='RequestedBy' :style='{ color: current.requestedBy.color }'>{{ current.requestedBy.name }}</div>
                        <div class='Length'>{{ getLengthString(current.length) }}</div>
                    </div>
                </div>
            </div>
            <div class='Icon Skip' @click='() => skip()' />
        </div>
        <div class='Request' v-for='(request, index) of requests' :key='request.index.toString()'>
            <div class='Left'>
                <div class='Index'>{{ index + 1 }}</div>
                <div class='Info'>
                    <div class='Title'>{{ request.title }}</div>
                    <div class='Bottom'>
                        <div class='RequestedBy' :style='{ color: request.requestedBy.color }'>{{ request.requestedBy.name }}</div>
                        <div class='Length'>{{ getLengthString(request.length) }}</div>
                    </div>
                </div>
            </div>
            <div class='Icon' :class='iconClasses[request.type]' />
        </div>
    </TransitionGroup>
</div>
</template>

<style scoped>
#requests {
    position: relative;
	min-height: 100%;
	width: 100%;
    overflow-y: auto;
}

#requests {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
#requests::-webkit-scrollbar { 
    display: none;
}

.transitionGroup-move,
.transitionGroup-enter-active,
.transitionGroup-leave-active {
    transition: all .5s ease !important;
}

.transitionGroup-leave-active {
    opacity: 0;
    position: absolute;
}

.Current {
    width: calc(100% - 2rem) !important;
    padding: 1rem;

    color: white;
    background-color: black;

    cursor: initial !important;
}

.Current:hover {
    transform: none !important;
}

.Request {
    width: 100%;

    display: flex;
    justify-content: space-between;

    border-bottom: 1px solid black;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    transition-property: transform;
    transition-duration: .1s;

    user-select: none;
    cursor: pointer;
}

.Request:not(:last-child) {
    margin-bottom: 2rem;
}

.Request:hover {
    transform: scale(1.01);
}

.Left {
    flex-shrink: 1;
}

.Index {
    margin-right: 1rem;
    display: inline-block;
    font-size: 2rem;
}

.Info {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.Title {
    font-size: 1.5rem;
    font-weight: 600;
}

.RequestedBy {
    display: inline-block;
    margin-right: 2rem;

    font-size: 1.25rem;
    font-weight: 400;
}

.Length {
    display: inline-block;
}

.Icon {
    width: 3rem;
    height: 3rem;
    margin-right: 1rem;
    
    background-size: cover;
    filter: brightness(0);
    border-radius: 50%;
}

.Icon.Spotify {
    background-image: url('../assets/spotify.svg');
}

.Icon.Youtube {
    background-image: url('../assets/youtube.svg');
}

.Icon.SoundCloud {
    background-image: url('../assets/soundcloud.svg');
}

.Icon.Skip {
    margin-top: .5rem;
    margin-right: 0;
    background-image: url('../assets/skip.svg');
    filter: invert(1);

    cursor: pointer;
}
</style>