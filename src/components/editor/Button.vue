<template>
    <button :text="title" :callbackKey="callback"></button>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from "vue-property-decorator";

    @Component
    export default class ToolboxButton extends Vue {
        @Prop()
        public title?: string;
        @Prop({default: () => null})
        public callback?: string;
    }
</script>
