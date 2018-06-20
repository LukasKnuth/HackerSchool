<template>
    <xml v-pre id="toolbox" style="display: none">
        <slot></slot>
    </xml>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from "vue-property-decorator";

    @Component
    export default class Toolbox extends Vue {

    }
</script>
