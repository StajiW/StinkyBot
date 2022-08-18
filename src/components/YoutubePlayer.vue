<script setup lang='ts'>
import { onMounted, PropType } from 'vue'
import { YoutubeRequest } from '../scripts/youtube'

const props = defineProps({
    request: {
        type: Object as PropType<YoutubeRequest>,
        required: true
    }
})

onMounted(() => {
    // @ts-ignore
    const player = new YT.Player(`youtubePlayer${props.request.index}`, {
        width: '100%',
        height: '100%',
        videoId: props.request.id,
        playerVars: {
            autoplay: 1,
            rel: 0
        }
    })
})

// @ts-ignore

</script>

<template>
<div id='youtubeContainer'>
    <div :id='`youtubePlayer${props.request.index}`' />
</div>
</template>

<style scoped>
#youtubeContainer {
    position: absolute;
    width: 100%;
    height: 100%;
}

#youtubePlayer {
    width: 100% !important;
    height: 100% !important;
}
</style>