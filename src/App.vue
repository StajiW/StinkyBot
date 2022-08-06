<script setup lang='ts'>
import { onMounted, ref, reactive } from 'vue'
import { getTwitchAuthURL, ChatBot } from './scripts/twitch'
import { Request } from './scripts/request'
import { YoutubeRequest } from './scripts/youtube'
import Settings from './components/Settings.vue'
import { defaultSettings } from './scripts/settings'
import Requests from './components/Requests.vue'
import { User } from './scripts/util'
import Player from './components/Player.vue'

let chatBot: ChatBot | null = null
let loggedIn = ref(false)
let inSettings = ref(false)
let requests: Request[] = reactive([])
let settings = reactive(defaultSettings)
let current = ref<Request | null>(null)

onMounted(async () => {
	const pathName = window.location.pathname

	if (pathName === '/twitchcallback/') {
		const href = window.location.href.replace('#', '?')
    	const params = new URL(href).searchParams

    	if (params.get('error')) return

    	const accessToken = params.get('access_token')

		if (accessToken === null) return

		chatBot = await ChatBot.login(accessToken)
		chatBot.connect('stajiw')
		chatBot.on('request', async (user: User, request: string) => {
			requests.push(await YoutubeRequest.fromURL(request, user.name, user.color))
		})
		loggedIn.value = true

		history.pushState(null, '', '/')
	}

	requests.push(await YoutubeRequest.fromURL('https://www.youtube.com/watch?v=DjYZ0enekbQ', 'StajiW', '#FF69B4'))
	requests.push(await YoutubeRequest.fromURL('https://www.youtube.com/watch?v=z3CxXTMmSvk', 'StajiW', '#FF69B4'))
	current.value = requests[0]
})
</script>

<template>
<div id='content'>
	<div id='topBar'>
		<div id='header'>StinkyBot<span> by <a href='https://www.twitch.tv/stajiw'>StajiW</a></span></div>
		<div id='settingsIcon' v-if='loggedIn' @click='inSettings = true'/>
	</div>
	<div id='bottomBar' v-if='loggedIn'>
		<div class='Column'>
			<Requests :requests='requests' />
		</div>
		<div class='Column'>
			<Player :request='current || undefined' />
		</div>
	</div>
</div>

<a :href='getTwitchAuthURL()' v-if='!loggedIn'><div class='Button Centered'>Log in with your Twitch (bot) account</div></a>

<Settings :active='inSettings' :settings='settings' @exit='inSettings = false'/>

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
	font-size: 2rem;
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

.Button {
	width: 20rem;
	padding: 2rem;

	text-align: center;
	font-size: 2rem;
	font-weight: 700;

	border: 5px solid black;

	user-select: none;
	cursor: pointer;

	background-color: white;
}

.Centered {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
</style>
