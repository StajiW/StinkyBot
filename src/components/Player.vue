<script setup lang='ts'>
import { PropType } from 'vue'
import { Request, RequestType } from '../scripts/request.js'

const props = defineProps({
    request: {
        type: Object as PropType<Request>,
        required: false
    }
})
</script>

<template>
<div id='player'>
    <div id='iFrame' v-if='request'>
        <iframe v-if='request.type === RequestType.Youtube' id='video' width="560" height="315"
        :src='`https://www.youtube.com/embed/${request.id}?autoplay=1&mute=1`' title="YouTube video player" frameborder="0">
        </iframe>
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

#iFrame {
    position: absolute;
    width: 100%;
    height: 100%;
}

iframe {
    width: 100% !important;
    height: 100% !important;
}
</style>