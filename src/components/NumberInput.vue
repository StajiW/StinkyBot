<script setup lang='ts'>
import { computed } from 'vue'

const props = defineProps({
    label: {
        type: String,
        required: true
    },
    modelValue: {
        type: Number,
        required: true
    }
})

const emit = defineEmits([ 'update:modelValue' ])

let val = computed({
    get() { return isNaN(props.modelValue) ? '' : props.modelValue.toString() },
    set() {}
})

let prevVal = props.modelValue.toString()

function handleInput(e: Event) {
    const target: HTMLInputElement = e.target as HTMLInputElement
    let value = target.value.replace(/\D/g,'')
    if (target.value.length > 5) value = prevVal
    target.value = value
    prevVal = value
    emit('update:modelValue', parseInt(target.value))
}
</script>

<template>
<div class='Setting'>
    <div class='Label'>{{ label }}</div>
    <input type='text' v-model='val' @input='(e) => handleInput(e)' />
</div>
</template>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input {
    width: 3em;
    -moz-appearance: textfield;
}
</style>