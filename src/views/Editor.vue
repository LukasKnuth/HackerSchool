<template>
    <b-container>
        <b-row>
            <h1>Editor</h1>
        </b-row>
        <b-row>
            <b-col>
                <game />
                <b-button variant="primary" @click="runGame()">Run Game</b-button>
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
    import Game from "../components/game/index.vue";

    @Component({
        components: {BlocklyEditor, Game}
    })
    export default class Lessons extends Vue {

        public runGame() {
            // Todo take code from blockly, give it to game, restart the game.
        }
    }
</script>