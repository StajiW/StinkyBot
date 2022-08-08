<script setup lang='ts'>
import TextInput from './TextInput.vue'
import { PropType, reactive, watch, ref } from 'vue'
import { defaultSettings, Settings } from '../scripts/settings'
import { deepCopy } from '../scripts/util'
import TwitchClient from '../scripts/twitch'
import SpotifyClient from '../scripts/spotify'
import NumberInput from './NumberInput.vue'
import AccountInput from './AccountInput.vue'

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

const twitchClient = TwitchClient.getInstance()
const spotifyClient = SpotifyClient.getInstance()
let settings: Settings = reactive(deepCopy(props.settings) as Settings)
let page = ref(0)
let closeMenu = ref(false)

const emit = defineEmits(['exit', 'save'])

function handleClick(e: MouseEvent) {
    const target = e.target as HTMLElement
    if (target.id === 'settingsContainer') {
        emit('exit')
    }
    if (!target.classList.contains('Menu') && !target.classList.contains('Dots')) {
        closeMenu.value = !closeMenu.value
    }
}

function save() {
    if (isNaN(settings.maxDuration)) settings.maxDuration = defaultSettings.maxDuration
    if (isNaN(settings.maxRequests)) settings.maxRequests = defaultSettings.maxRequests
    emit('save', settings)
}

watch(() => props.active, () => {
    if (props.active) Object.assign(settings, reactive(deepCopy(props.settings) as Settings))
})
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
                        <a v-if='!spotifyClient.loggedIn' :href='spotifyClient.getAuthURL()' @click='spotifyClient.followLink'><div class='Icon InActive' id='spotify' /></a>
                        <div v-else class='Icon' :class='{ InActive: !settings.spotify }' id='spotify' @click='settings.spotify = !settings.spotify' />
                        <div class='Icon' :class='{ InActive: !settings.youtube }' id='youtube' @click='settings.youtube = !settings.youtube' />
                        <div class='Icon' :class='{ InActive: !settings.soundCloud }' id='soundCloud' @click='settings.soundCloud = !settings.soundCloud'/>
                    </div>
                </div>
                <div class='Section'>
                    <div class='Name'>Requests</div>
                    <NumberInput label='Max request length (minutes)' v-model='settings.maxDuration' />
                    <NumberInput label='Max requests per user' v-model='settings.maxRequests' />
                </div>
                <div class='Section'>
                    <div class='Name'>Twitch</div>
                    <TextInput label='Channel' v-model='settings.connectedChannel'/>
                    <AccountInput
                    label='Bot Account'
                    :user='twitchClient.userName || undefined'
                    :connectLink='TwitchClient.getAuthURL()'
                    :closeMenu='closeMenu'
                    />
                </div>
                <div class='Section'>
                    <div class='Name'>Music</div>
                    <AccountInput
                    label='Spotify Account'
                    :user='spotifyClient.userName || undefined'
                    :connectLink='spotifyClient.getAuthURL()'
                    @connect='(e) => spotifyClient.followLink(e)'
                    :closeMenu='closeMenu'  
                    />
                    <TextInput label='Fallback Playlist' v-model='settings.fallback'/>
                </div>
            </div>
            <div class='Page'>
                <div class='Nav' id='topLeft' @click='page = 0'><div class='Arrow' /> General</div>
                <TextInput label='Request' v-model='settings.fallback' />
                <TextInput label='Edit' v-model='settings.fallback' />
                <TextInput label='Cancel Request' v-model='settings.fallback' />
                <TextInput label='Position' v-model='settings.fallback' />
                <TextInput label='Queue' v-model='settings.fallback' />
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

#save {
    text-align: center;
    padding: .5rem;
    border: 1px solid #AAAAAA;
    user-select: none;
    cursor: pointer;
    border-radius: .25rem;
}

.UnEditable > div {
    display: inline-block;
}
</style>

<style>
input {
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

input:focus {
    outline: none;
}
</style>