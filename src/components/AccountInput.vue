<script setup lang='ts'>
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
    }
})
</script>

<template>
<div class='Setting'>
    <div class='Label'>{{ label }}</div>
    <div class='Account' v-if='user !== undefined'>
        <div class='AccountName'>{{ user }}</div>
        <div class='Logout' @click='$emit("logout")'/>
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

.Logout {
    display: inline-block;

    width: 1em;
    height: 1em;
    margin-left: .5em;
    margin-bottom: -.2em;

    background-image: url('../assets/logout.svg');
    background-size: cover;

    cursor: pointer;
}
</style>