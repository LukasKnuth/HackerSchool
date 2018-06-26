<template>
    <b-container>
        <b-row>
            <h1>{{level.name}}</h1>
        </b-row>
        <b-row>
            <b-col>
                <game ref="game" :level="level"
                      @block-executing="highlightBlock"
                      :running.sync="gameIsRunning"
                />
                <b-button :variant="buttonColor" @click="buttonClick">{{buttonText}}</b-button>
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
    export default class Editor extends Vue {

        @Prop({default: () => new MazeLevel1()})
        public level?: Level;

        private gameIsRunning: boolean = false;

        get buttonColor() {
            return this.gameIsRunning ? "danger" : "primary";
        }
        get buttonText() {
            return this.gameIsRunning ? "Stop Game" : "Run Game";
        }

        public buttonClick() {
            if (this.gameIsRunning) {
                (this.$refs.game as any).stopGame();
            } else {
                const code = (this.$refs.editor as any).compile();
                (this.$refs.game as any).startGame(code);
            }
        }

        public highlightBlock(blockId: string) {
            (this.$refs.editor as any).highlightBlock(blockId);
        }
    }
</script>

<style lang="scss">
    .header-spacing {
        margin-top: 20px;
    }
</style>