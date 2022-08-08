<script setup lang='ts'>
import { onMounted, ref, reactive } from 'vue'
import TwitchClient from './scripts/twitch'
import SpotifyClient from './scripts/spotify'
import { getRequestFromMessage } from './scripts/request'
import { YoutubeRequest } from './scripts/youtube'
import SettingsPage from './components/SettingsPage.vue'
import { defaultSettings, Settings } from './scripts/settings'
import Requests from './components/Requests.vue'
import { Request, User } from './scripts/util'
import Player from './components/Player.vue'
import Cookies from 'js-cookie'

const twitchClient = TwitchClient.getInstance()
const spotifyClient = SpotifyClient.getInstance()
let loggedIn = ref(false)
let loaded = ref(false)
let inSettings = ref(false)
let requests: Request[] = reactive([])
let settings: Settings = reactive(getSettings())
let current = ref<Request | null>(null)

onMounted(async () => {
	const pathName = window.location.pathname

	if (pathName === '/twitchcallback/') {
		await twitchCallback()
	}
	else if (pathName === '/spotifycallback/') {
		await spotifyCallback()
	}
	else {
		const twitchToken = Cookies.get('twitchToken')
		if (twitchToken !== undefined && await TwitchClient.tokenIsValid(twitchToken)) await twitchLogin(twitchToken)

		const spotifyToken = Cookies.get('spotifyToken')
		if (spotifyToken !== undefined) await spotifyLogin(spotifyToken)
	}

	const user: User = {
		name: 'StajiW',
		id: 0,
		color: '#FF69B4'
	}
	requests.push(await YoutubeRequest.fromURL('https://www.youtube.com/watch?v=DjYZ0enekbQ', user))
	requests.push(await YoutubeRequest.fromURL('https://www.youtube.com/watch?v=z3CxXTMmSvk', user))
	current.value = requests[0]

	loaded.value = true
})

async function twitchCallback() {
	const href = window.location.href.replace('#', '?')
	const params = new URL(href).searchParams

	if (params.get('error')) return
	const accessToken = params.get('access_token')
	if (accessToken === null) return

	Cookies.set('twitchToken', accessToken)

	window.location.href = '/'
}

async function twitchLogin(token: string) {
	await twitchClient.login(token)
	twitchClient.connect('stajiw')
	twitchClient.on('request', request)
	loggedIn.value = true
}

async function spotifyCallback() {
	const params = new URL(window.location.href).searchParams

	if (params.get('error')) return
	const code = params.get('code')
	if (code === null) return


	const body = await SpotifyClient.getAccessToken(code)
	const expires = new Date().getTime() + body.expires_in * 1000
	Cookies.set('spotifyToken', body.access_token)
	Cookies.set('spotifyRefreshToken', body.refresh_token)
	Cookies.set('expires', expires.toString())

	window.location.href = '/'
}

async function spotifyLogin(token: string) {
	spotifyClient.login(token, Cookies.get('spotifyRefreshToken')!, parseInt(Cookies.get('expires')!))
}

async function request(user: User, request: string) {
	await getRequestFromMessage(request, user)
}

function getSettings(): Settings {
	const str = Cookies.get('settings')
	if (str) return JSON.parse(str)
	return defaultSettings
}

function saveSettings(newSettings: Settings) {
	Object.assign(settings, newSettings)
	Cookies.set('settings', JSON.stringify(settings))
}
</script>

<template>
<div id='content'>
	<div id='topBar'>
		<div id='header'>StinkyBot<span> by <a href='https://www.twitch.tv/stajiw'>StajiW</a></span></div>
		<div id='settingsIcon' @click='inSettings = true'/>
	</div>
	<div id='bottomBar'>
		<div class='Column'>
			<Requests :requests='requests' />
		</div>
		<div class='Column'>
			<Player :request='current || undefined' />
		</div>
	</div>
</div>

<!-- <a :href='TwitchClient.getAuthURL()' v-if='!loggedIn && loaded'><div class='Button Centered'>Log in with your Twitch (bot) account</div></a> -->

<SettingsPage
v-if='loaded'
:active='inSettings'
:settings='settings'
@exit='inSettings = false'
@save='(newSettings: Settings) => saveSettings(newSettings)'
/>

</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;600&display=swap');

:root {
	font-family: 'Roboto Mono', monospace;
}

html, body {
	position: absolute;
	margin: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
}

#content {
	position: absolute;
	margin: 2rem;
	width: calc(100% - 4rem);
	height: calc(100% - 4rem);

	display: flex;
	flex-direction: column;
}

#topBar {
	display: flex;
	justify-content: space-between;
}

#header {
	font-size: 3rem;
	font-weight: 700;
	padding-bottom: 1rem;

	user-select: none;
}

#header > span {
	font-size: 1.5rem;
	font-weight: 300;
}

#header > span > a {
	text-decoration: underline;
}

#settingsIcon {
	width: 2.5rem;
	height: 2.5rem;

	background-image: url('./assets/settings.svg');
	background-size: cover;

	border-radius: 50%;

	transition-property: transform;
	transition-duration: .2s;

	cursor: pointer;
}

#settingsIcon:hover {
	transform: rotate(30deg);
}

#bottomBar {
	flex-grow: 1;
	overflow-y: hidden;
	width: 100%;
	display: flex;
	justify-content: space-between;
}

.Column {
	width: calc(50% - 1rem);
	height: 100%;
}

#video {
	height: calc(9 / 16 * 100%);
	width: 100%;
	background-color: black;
}

a {
	text-decoration: none;
	color: black;
}

.Centered {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

/* @media (max-width: 800px) {
	html { font-size: 0.8rem; }
	.Column { width: 100%; }
	#bottomBar { flex-direction: column-reverse; }
} */
</style>
