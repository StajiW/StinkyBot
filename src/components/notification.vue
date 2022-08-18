<script setup lang='ts'>
import { ref, watch } from 'vue'

const props = defineProps(['notification'])
const emit = defineEmits(['dismiss'])
const text = ref(props.notification)

function handleClick(e: MouseEvent) {
    const target = e.target as HTMLElement
    if (target.id === 'notificationContainer') {
        emit('dismiss')
    }
}

watch(() => props.notification, () => {
    if (props.notification !== undefined) {
        text.value = props.notification
    }
})
</script>

<template>
<div id='notificationContainer' @click='(e) => handleClick(e)' :class='{ InActive: notification === undefined }'>
    <div id='notification' class='Centered'>{{ text }}</div>
</div>
</template>

<style scoped>
#notificationContainer {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);

    transition-property: opacity;
    transition-duration: .2s;
}

#notificationContainer.InActive {
    opacity: 0;
    pointer-events: none;
}

#notification {
    max-width: 25rem;
    padding: 2rem;

    font-size: 1rem;

    background-color: white;
    border-radius: .25rem;
}
</style>