<script setup lang='ts'>
import { onMounted, PropType } from 'vue'
import { Request } from '../scripts/request.js'
const props = defineProps({
    requests: {
        type: Array as PropType<Request[]>,
        required: true
    }
})

const iconClasses = {
    0: 'Spotify',
    1: 'Youtube',
    2: 'SoundCloud'
}
</script>

<template>
<div id='requests'>
    <div class='Request' v-for='(request, index) of requests'>
        <div class='Left'>
            <div class='Index'>{{ index + 1 }}</div>
            <div class='Info'>
                <div class='Title'>{{ request.title }}</div>
                <div class='RequestedBy' :style='{ color: request.color }'>{{ request.requestedBy }}</div>
            </div>
        </div>
        <div class='Icon' :class='iconClasses[request.type]' />
    </div>
</div>
</template>

<style scoped>
#requests {
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
    font-size: 1.25rem;
    font-weight: 400;
}

.Icon {
    width: 3rem;
    height: 3rem;
    
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
</style>