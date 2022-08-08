<script setup lang='ts'>
import { PropType, ref } from 'vue'
import { Request, RequestType } from '../scripts/util.js'

const started = ref(false)

const props = defineProps({
    request: {
        type: Object as PropType<Request>,
        required: false
    }
})
</script>

<template>
<div id='player'>
    <div id='activate' v-if='!started' @click='started = true'><div>Click to enable player</div></div>
    <div id='iFrame' v-if='request && started'>
        <iframe v-if='request.type === RequestType.Youtube' id='video' width="560" height="315"
        :src='`https://www.youtube.com/embed/${request.id}?autoplay=1`' title="YouTube video player" frameborder="0">
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