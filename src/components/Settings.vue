<script setup lang='ts'>
import { PropType } from 'vue'
import { Settings } from '../scripts/settings.js'

const props = defineProps({
    settings: {
        type: Object as PropType<Settings>,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    }
})

const emit = defineEmits(['exit'])

function handleClick(e: MouseEvent) {
    const target = e.target as HTMLElement
    if (target.id === 'settingsContainer') {
        emit('exit')
    }
}

function isNumber(e: KeyboardEvent) {
    return !isNaN(parseInt(e.key))
}
</script>

<template>
<div id='settingsContainer' @click='(e) => handleClick(e)' :class='{ InActive: !active }'>
    <div class='Centered' id='settings'>
        <div class='Section'>
            <div class='Name'>Platforms</div>
            <div id='platforms'>
                <div class='Icon InActive' id='spotify' />
                <div class='Icon' id='youtube' />
                <div class='Icon' id='soundCloud' />
            </div>
        </div>
        <div class='Section'>
            <div class='Name'>Requests</div>
            <div class='Setting'>
                <div class='Name'>Max request length (minutes)</div>
                <input type='number' size='1' :onkeypress='(e: KeyboardEvent) => { return isNumber(e) }'>
            </div>
            <div class='Setting'>
                <div class='Name'>Max requests per user</div>
                <input type='number' size='1' :onkeypress='(e: KeyboardEvent) => { return isNumber(e) }'>
            </div>
        </div>
        <div class='Section'>
            <div class='Name'>Twitch</div>
            <div class='Setting'>
                <div class='Name'>Channel</div>
                <input type='text'>
            </div>
            <div class='Setting'>
                <div class='Name'>Bot Account</div>
                <div>ChannelName</div>
            </div>
        </div>
    </div>
</div>
</template>

<style scoped>
#settingsContainer {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);

    transition-property: opacity;
    transition-duration: .2s;
}

#settingsContainer.InActive {
    opacity: 0;
    pointer-events: none;
}

#settings {
    width: 21rem;
    padding: 2rem;

    font-size: 1.4rem;

    background-color: white;
}

.Section:not(:last-child) {
    margin-bottom: 1rem;
}

.Section > .Name {
    margin-bottom: .8rem;
    padding-bottom: .5rem;
    border-bottom: 1px solid gray;
}

.Setting {
    width: 100%;
    margin-top: -.3rem;
    display: flex;
    justify-content: space-between;

    font-size: 1rem;
}

.Setting:not(:last-child) {
    margin-bottom: .5rem;
}

.Setting input {
    min-width: 0;
    width: 10em;
    
    font-size: inherit;
    font-family: inherit;
    font-weight: inherit;
    text-align: right;

    border: none;
    border-bottom: 1px solid black
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type=number] {
    width: 3em;
    -moz-appearance:textfield; /* Firefox */
}

.Setting input:focus {
    outline: none;
}

.Icon {
    display: inline-block;
    width: 1em; 
    height: 1em;
    margin-right: .8rem;
    background-size: cover;

    padding: 1rem;

    transition-property: opacity;
    transition-duration: .2s;

    cursor: pointer;
}

.Icon.InActive { 
    opacity: 0.5;
}

.Icon:hover {
    opacity: 0.5;
}

.Icon.InActive:hover {
    opacity: 1;
}

.Icon .Warning {
    width: 2rem;
    height: 2rem;
    margin-left: 2rem;
    margin-top: -2rem;
    background: url('../assets/warning.svg');
    background-size: 1.25rem;
    background-repeat: no-repeat;
    background-position: center;
    background-color: black;
    border-radius: 50%;
}

#spotify {
    background-image: url('../assets/spotify.svg');
}

#youtube {
    background-image: url('../assets/youtube.svg');
}

#soundCloud {
    background-image: url('../assets/soundcloud.svg');
}
</style>