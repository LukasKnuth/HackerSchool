<template>
    <b-container>
        <b-row>
            <h1>{{level.name}}</h1>
        </b-row>
        <b-row>
            <b-col>
                <game ref="game" :level="level"
                      @block-executing="highlightBlock"
                      @debug-log-append="debugLogAppend"
                      :running.sync="gameIsRunning"
                />
                <b-container>
                    <b-row class="stat-row">
                        <b-col cols="5">Instructions</b-col>
                        <b-col>{{instructionCounter}}</b-col>
                    </b-row>
                    <b-row class="stat-row">
                        <b-col cols="5">Blocks</b-col>
                        <b-col>{{blockCount}} / {{level.maxBlocks}}</b-col>
                    </b-row>
                    <b-row class="control-row" align-h="center">
                        <b-col cols="5">
                            <b-button :variant="runButtonColor" @click="runButtonClick">{{runButtonText}}</b-button>
                        </b-col>
                    </b-row>
                </b-container>
                <h3 class="header-spacing">Description</h3>
                <p>{{level.description}}</p>
            </b-col>
            <b-col cols="8" id="blocklyArea">
                <blockly-editor ref="editor"
                                :level="level"
                                :blocks.sync="blockCount"
                />
            </b-col>
        </b-row>
        <div class="overlay">
            <div class="preview">
                <h3 class="peek" @click="showDebugLog = !showDebugLog">
                    <font-awesome-icon :icon="debugLogIcon" />
                    <span class="title">Debug Log</span>
                    <b-badge variant="primary">{{debugLog.length}}</b-badge>
                </h3>
            </div>
            <div class="scrollable" v-show="showDebugLog" @mouseleave="onLogLeave">
                <b-table hover
                         :items="debugLog"
                         :fields="logTableFields"
                         @row-hovered="onLogHover"
                ></b-table>
            </div>
        </div>
    </b-container>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import BlocklyEditor from "../components/editor/index.vue";
    import Game from "../components/game/index.vue";
    import {Level} from "../content/Lesson";
    import MazeLevel1 from "../content/lessons/maze/levels/Level1";

    interface DebugLogEntry {
        line: string,
        blockId: string;
        instruction: number;
    }

    @Component({
        components: {BlocklyEditor, Game}
    })
    export default class Editor extends Vue {

        @Prop({default: () => new MazeLevel1()})
        public level?: Level;

        public instructionCounter: number = 0;
        public gameIsRunning: boolean = false;
        public blockCount: number = 0;
        public debugLog: DebugLogEntry[] = [];
        public showDebugLog: boolean = false;

        get debugLogIcon() {
            return this.showDebugLog ? "angle-down" : "angle-up";
        }
        get logTableFields() {
            return [{key: "line", label: "Log Output"}, {key: "instruction", label: "At Instruction"}];
        }

        get runButtonColor() {
            return this.gameIsRunning ? "danger" : "primary";
        }
        get runButtonText() {
            return this.gameIsRunning ? "Stop Game" : "Run Game";
        }

        public runButtonClick() {
            if (this.gameIsRunning) {
                (this.$refs.game as any).stopGame();
            } else {
                this.debugLog = [];
                this.instructionCounter = 0;
                const code = (this.$refs.editor as any).compile();
                console.log(`-------- ${new Date()}: Newly generated code ------\n`, code);
                (this.$refs.game as any).startGame(code);
            }
        }

        public highlightBlock(blockId: string) {
            this.instructionCounter++;
            (this.$refs.editor as any).highlightBlock(blockId);
        }
        public debugLogAppend(log: string, blockId: string) {
            this.debugLog.push({line: log, blockId: blockId, instruction: this.instructionCounter});
        }
        public onLogHover(item?: DebugLogEntry) {
            (this.$refs.editor as any).highlightBlock(item.blockId);
        }
        public onLogLeave() {
            (this.$refs.editor as any).highlightBlock(null);
        }

    }
</script>

<style lang="scss">
    .header-spacing {
        margin-top: 20px;
    }
    .stat-row {
        margin-top: 2px;
    }
    .control-row {
        margin-top: 20px;
    }
    .overlay {
        padding: 0 20px;
        position: absolute;
        z-index: 1000;
        bottom: 0;
        left: 0;
        right: 0;

        .peek {
            cursor: pointer;
            .title {
                margin: 0 10px 0 20px;
            }
        }
        .scrollable {
            background-color: white;
            height: 250px;
            overflow-y: scroll;
        }
    }
</style>