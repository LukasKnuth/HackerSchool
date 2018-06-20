<template>
    <block :type="type"></block>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from "vue-property-decorator";

    @Component
    export default class ToolboxBlock extends Vue {
        @Prop()
        public type: string;
    }
</script>
