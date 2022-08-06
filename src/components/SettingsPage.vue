<script setup lang='ts'>
import { PropType, reactive } from 'vue'
import { defaultSettings, Settings } from '../scripts/settings'
import { deepCopy } from '../scripts/util'

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

let settings: Settings = reactive(deepCopy(props.settings) as Settings)

const emit = defineEmits(['exit', 'save'])

function handleClick(e: MouseEvent) {
    const target = e.target as HTMLElement
    if (target.id === 'settingsContainer') {
        emit('exit')
        Object.assign(settings, reactive(deepCopy(props.settings) as Settings))
    }
}

function isNumber(e: KeyboardEvent) {
    return !isNaN(parseInt(e.key))
}

function isEmptyString(num: number) {
    return (num !== 0 && !num)
}

function save() {
    if (isEmptyString(settings.maxDuration)) settings.maxDuration = defaultSettings.maxDuration
    if (isEmptyString(settings.maxRequests)) settings.maxRequests = defaultSettings.maxRequests
    emit('save', settings)
}
</script>

<template>
<div id='settingsContainer' @click='(e) => handleClick(e)' :class='{ InActive: !active }'>
    <div class='Centered' id='settings'>
        <div class='Section'>
            <div class='Name'>Platforms</div>
            <div id='platforms'>
                <div class='Icon' :class='{ InActive: !settings.spotify }' id='spotify' />
                <div class='Icon' :class='{ InActive: !settings.youtube }' id='youtube' @click='settings.youtube = !settings.youtube' />
                <div class='Icon' :class='{ InActive: !settings.soundCloud }' id='soundCloud' @click='settings.soundCloud = !settings.soundCloud'/>
            </div>
        </div>
        <div class='Section'>
            <div class='Name'>Requests</div>
            <div class='Setting'>
                <div class='Name'>Max request length (minutes)</div>
                <input type='number' size='1' v-model='settings.maxDuration' :onkeypress='(e: KeyboardEvent) => { return isNumber(e) }'>
            </div>
            <div class='Setting'>
                <div class='Name'>Max requests per user</div>
                <input type='number' size='1' v-model='settings.maxRequests' :onkeypress='(e: KeyboardEvent) => { return isNumber(e) }'>
            </div>
        </div>
        <div class='Section'>
            <div class='Name'>Twitch</div>
            <div class='Setting'>
                <div class='Name'>Channel</div>
                <input type='text' v-model='settings.connectedChannel'>
            </div>
            <div class='Setting'>
                <div class='Name'>Bot Account</div>
                <div class='UnEditable'>
                    <div>ChannelName</div>
                    <div class='Dots' />
                </div>
            </div>
        </div>
        <div class='Section'>
            <div class='Name'>Music</div>
            <div class='Setting'>
                <div class='Name'>Spotify Account</div>
                <div class='UnEditable'>
                    <div>AccountName</div>
                    <div class='Dots' />
                </div>
            </div>
            <div class='Setting'>
                <div class='Name'>Fallback Playlist</div>
                <input class='Grow' type='text' v-model='settings.fallback'>
            </div>
        </div>
        <div class='Section'>
            <div id='save' @click='save()'>Save</div>
        </div>
    </div>
</div>
</template>

<style scoped>
#settingsContainer {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);

    transition-property: opacity;
    transition-duration: .2s;
}

#settingsContainer.InActive {
    opacity: 0;
    pointer-events: none;
}

#settings {
    width: 25rem;
    padding: 2rem;

    background-color: white;
    border-radius: .25rem;
}

.Section:not(:last-child) {
    margin-bottom: 1rem;
}

.Section > .Name {
    display: inline-block;
    margin-bottom: .5rem;

    font-size: 1.25rem;
    border-bottom: 1px solid #AAAAAA;
}

.Setting {
    margin: auto;
    width: 100%;
    display: flex;
    justify-content: space-between;

    font-size: 0.9rem;
}

.Setting > .Name {
    margin-right: 1rem;
}

.Setting:not(:last-child) {
    margin-bottom: .5rem;
}

.Setting input {
    min-width: 0;
    width: calc(50% - 1rem);
    padding: .25rem;
    margin: 0;
    margin-top: -.25rem;
    
    font-size: inherit;
    font-family: inherit;
    font-weight: inherit;
    text-align: right;

    border: none;
    border-radius: .25rem;
    background-color: #E0E0E0;
    color: #404040;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type=number] {
    width: 3em;
    -moz-appearance: textfield; /* Firefox */
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
    border-radius: .25rem;
}

.Icon.InActive { 
    opacity: 0.4;
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

.Setting .Button {
    width: calc(50% - 1rem);

    padding: 0.25rem;
    font-size: inherit;
    font-weight: 400;
    border: 1px solid black;
    box-sizing: border-box;
}

#save {
    text-align: center;
    padding: .5rem;
    border: 1px solid #AAAAAA;
    user-select: none;
    cursor: pointer;
    border-radius: .25rem;
}

.Dots {
    width: 1.25em;
    height: 1.25em;
    margin-bottom: -.25em;
    background-image: url(../assets/dots.svg);
    background-size: cover;
}

.UnEditable > div {
    display: inline-block;
}
</style>