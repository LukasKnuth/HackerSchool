<template>
    <b-container>
        <b-row>
            <h1>{{level.name}}</h1>
        </b-row>
        <b-row>
            <b-col>
                <game ref="game" :level="level" />
                <b-button variant="primary" @click="runGame()">Run Game</b-button>
                <b-button variant="danger" @click="stopGame()">Stop Game</b-button>
                <h3 class="header-spacing">Description</h3>
                <p>{{level.description}}</p>
            </b-col>
            <b-col cols="8" id="blocklyArea">
                <blockly-editor ref="editor" :level="level" />
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import BlocklyEditor from "../components/editor/index.vue";
    import Game from "../components/game/index.vue";
    import {Level} from "../content/Lesson";
    import MazeLevel1 from "../content/lessons/maze/levels/Level1";

    @Component({
        components: {BlocklyEditor, Game}
    })
    export default class Lessons extends Vue {

        @Prop({default: () => new MazeLevel1()})
        public level: Level;

        public runGame() {
            const code = (this.$refs.editor as BlocklyEditor).compile();
            (this.$refs.game as Game).startGame(code);
            console.log(code);
        }
        public stopGame() {
            (this.$refs.game as Game).stopGame();
        }
    }
</script>

<style lang="scss">
    .header-spacing {
        margin-top: 20px;
    }
</style>