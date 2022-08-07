<script setup lang='ts'>
import { PropType, reactive, watch, ref } from 'vue'
import { defaultSettings, Settings } from '../scripts/settings'
import { deepCopy } from '../scripts/util'
import { ChatBot } from '../scripts/twitch'

const props = defineProps({
    settings: {
        type: Object as PropType<Settings>,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    },
    chatBot: {
        type: Object as PropType<ChatBot>,
        required: false
    }
})

let settings: Settings = reactive(deepCopy(props.settings) as Settings)
let page = ref(0)
let suggestions = ref<string[]>([])
let lastUpdate = 0

const emit = defineEmits(['exit', 'save'])

function handleClick(e: MouseEvent) {
    const target = e.target as HTMLElement
    if (target.id === 'settingsContainer') {
        emit('exit')
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

watch(() => props.active, () => {
    if (props.active) Object.assign(settings, reactive(deepCopy(props.settings) as Settings))
})

async function updateSuggestions(str: string) {
    console.log(str)
    const time = new Date().getTime()
    lastUpdate = time
    if (props.chatBot === undefined) return
    if (lastUpdate - time < 1000) return

    const names = await props.chatBot.searchChannels(str)
    suggestions.value = names
}
</script>

<template>
<div id='settingsContainer' @click='(e) => handleClick(e)' :class='{ InActive: !active }'>
    <div class='Centered' id='settings'>
        <div id='pageContainer' :style='{ marginLeft: (page === 1) ? "calc(-100% - 4rem)" : "" }'>
            <div class='Page'>
                <div class='Nav' id='topRight' @click='page = 1'>Chat Commands <div class='Arrow' /></div>
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
                        <div class='InputContainer'>
                            <input type='text' v-model='settings.connectedChannel' >
                            <div class='Suggestions' v-if='suggestions.length > 0' @input='(e) => { updateSuggestions((e.target as HTMLInputElement).value) }'>
                                <div class='Suggestion' v-for='suggestion in suggestions'>{{ suggestion }}</div>
                            </div>
                        </div>
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
            </div>
            <div class='Page'>
                <div class='Nav' id='topLeft' @click='page = 0'><div class='Arrow' /> General</div>
                <div class='Setting'>
                    <div class='Name'>Request</div>
                    <input class='Grow' type='text' v-model='settings.fallback'>
                </div>
                <div class='Setting'>
                    <div class='Name'>Edit</div>
                    <input class='Grow' type='text' v-model='settings.fallback'>
                </div>
                <div class='Setting'>
                    <div class='Name'>Cancel Request</div>
                    <input class='Grow' type='text' v-model='settings.fallback'>
                </div>
                <div class='Setting'>
                    <div class='Name'>Position</div>
                    <input class='Grow' type='text' v-model='settings.fallback'>
                </div>
                <div class='Setting'>
                    <div class='Name'>Queue</div>
                    <input class='Grow' type='text' v-model='settings.fallback'>
                </div>
            </div>
        </div>
        <div id='save' @click='save()'>Save</div>
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
    overflow-x: hidden;

    background-color: white;
    border-radius: .25rem;
}

#pageContainer {
    width: calc(200% + 4rem);
    display: flex;
    justify-content: space-between;

    transition-property: margin-left;
    transition-duration: .5s;
}

.Page {
    position: relative;
    width: calc(50% - 2rem);
}

.Nav {
    position: absolute;

    user-select: none;
    cursor: pointer;
}

.Nav#topRight {
    top: 0;
    right: 0;
}

.Nav#topLeft {
    position: initial;
    display: inline-block;
    margin-bottom: 1rem;
}

.Nav .Arrow {
    display: inline-block;
    margin-bottom: -.2em;
    width: 1em;
    height: 1em;
    background-image: url('../assets/arrow.svg');
    background-size: cover;
}

.Nav#topLeft .Arrow {
    transform: rotate(180deg);
}

.Section {
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
    margin-bottom: .5rem;
    width: 100%;
    display: flex;
    justify-content: space-between;

    font-size: 0.9rem;
}

.Setting > .Name {
    margin-right: 1rem;
}

.Setting .InputContainer {
    position: relative;
    width: calc(50% - 1rem);
    margin-left: -.25rem;
}

.Setting .InputContainer input {
    width: 100%;
    margin-left: -.5rem;
}

.Suggestions {
    position: absolute;
    left: -.5rem;
    width: 100%;
    margin-top: .25rem;
    padding: .25rem;
    text-align: right;

    background-color: #E0E0E0;
    color: #404040;
    border-radius: .25rem;
    outline: .25rem solid white;
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