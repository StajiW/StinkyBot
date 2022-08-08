<script setup lang='ts'>
import { ref, watch } from 'vue'

const props = defineProps({
    label: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: false
    },
    connectLink: {
        type: String,
        required: true
    },
    closeMenu: {
        type: Boolean,
        required: true
    }
})

const menuOpen = ref(false)

watch(() => props.closeMenu, () => {
    menuOpen.value = false
})
</script>

<template>
<div class='Setting'>
    <div class='Label'>{{ label }}</div>
    <div class='Account' v-if='user !== undefined'>
        <div class='AccountName'>{{ user }}</div>
        <div class='Dots' @click='menuOpen = true'>
            <div class='Menu' :class='{ InActive: !menuOpen }'>
                <div class='Button'>Refresh token</div>
                <div class='Button'>Log out</div>
            </div>
        </div>
    </div>
    <a v-else :href='connectLink' @click='(e) => $emit("connect", e)'>
        <div class='Connect'>Connect</div>
    </a>
</div>
</template>

<style scoped>
.AccountName {
    display: inline-block;
}

.Dots {
    display: inline-block;
    width: 1.25em;
    height: 1.25em;
    margin-bottom: -.25em;
    background-image: url(../assets/dots.svg);
    background-size: cover;

    cursor: pointer;
}

.Menu {
    position: absolute;
    right: 0;
    width: 8.5rem;
    height: 2.5rem;
    /* padding: .25rem; */
    z-index: 2;

    text-align: center;
    overflow: hidden;

    background-color: white;
    border: 1px solid #AAAAAA;

    border-radius: .25rem;

    cursor: initial;

    transition-property: width, height, opacity;
    transition-duration: .1s;
}

.Menu.InActive {
    width: 2rem;
    height: 2rem;
    opacity: 0;
    color: rgba(0, 0, 0, 0);

    pointer-events: none;
}

.Button {
    width: 8rem;
    padding-left: .25rem;

    cursor: pointer;
    user-select: none;
    /* border: 1px solid #AAAAAA; */
}

.Connect {
    margin-top: -.25rem;
    padding: .25rem;
    padding-left: .5rem;
    padding-right: .5rem;
    border: 1px solid #AAAAAA;
    border-radius: .25rem;

    user-select: none;
    cursor: pointer;
}
</style>