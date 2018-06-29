<template>
    <category :name="name" :custom="custom">
        <slot></slot>
    </category>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from "vue-property-decorator";

    @Component
    export default class ToolboxCategory extends Vue {
        @Prop()
        public name?: string;
        @Prop({default: () => ""})
        public custom?: string;
    }
</script>
