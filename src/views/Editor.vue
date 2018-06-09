<template>
    <b-container>
        <b-row>
            <h1>Editor</h1>
        </b-row>
        <b-row>
            <b-col>
                <p>Render here...</p>
            </b-col>
            <b-col cols="8" id="blocklyArea">
                <blockly-editor />
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import BlocklyEditor from "../components/BlocklyEditor.vue";

    @Component({
        components: {BlocklyEditor}
    })
    export default class Lessons extends Vue {}
</script>