<script setup lang='ts'>
defineProps({
    label: {
        type: String,
        required: true
    },
    modelValue: {
        type: String,
        required: true
    }
})
</script>

<template>
<div class='Setting'>
    <div class='Label'>{{ label }}</div>
    <input type='text' v-model='modelValue' />
</div>
</template>

<style scoped>
</style>