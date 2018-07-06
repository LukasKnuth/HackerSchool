<template>
    <b-container fluid>
        <b-row>
            <b-col cols="4">
                <game ref="game" :level="level"
                      @block-executing="highlightBlock"
                      @debug-log-append="debugLogAppend"
                      @game-over="onGameOver"
                      :running.sync="gameIsRunning"
                      :paused.sync="gameIsPaused"
                />
                <b-container>
                    <b-row class="stat-row" :title="$t('game.stats.instructionCounterLabel')">
                        <b-col cols="2"><font-awesome-icon icon="shoe-prints"/></b-col>
                        <b-col>{{instructionCounter}}</b-col>
                    </b-row>
                    <b-row class="stat-row" :title="$t('game.stats.blocksCounterLabel')">
                        <b-col cols="2"><font-awesome-icon icon="puzzle-piece" /></b-col>
                        <b-col>{{blockCount}} / {{maxBlocks}}</b-col>
                    </b-row>
                    <b-row class="control-row justify-content-md-center" align-h="center">
                        <b-col md="auto">
                            <b-button :variant="runButtonColor"
                                      :disabled="!gameIsRunning && instructionCounter > 0"
                                      :title="runButtonText"
                                      @click="runButtonClick"
                                      class="game-control-btn"
                            ><font-awesome-icon :icon="runButtonIcon" /></b-button>
                            <b-button variant="danger"
                                      :title="$t('game.stopBtnLabel')"
                                      @click="stopButtonClick"
                                      class="game-control-btn"
                            ><font-awesome-icon icon="stop"/></b-button>
                        </b-col>
                    </b-row>
                </b-container>
            </b-col>
            <b-col cols="8" id="blocklyArea">
                <blockly-editor ref="editor"
                                :level="level"
                                :blocks.sync="blockCount"
                />
            </b-col>
        </b-row>
        <div class="overlay">
            <div class="scrollable">
                <b-table hover small :items="fullLog" :fields="logTableFields" thead-class="no-header">
                    <template slot="type" slot-scope="data">
                        <span :style="{color: data.item.color}">{{data.item.type}}</span>
                    </template>
                </b-table>
            </div>
        </div>
        <b-modal ref="gameOverModal"
                 :title="$t('game.modal.title')"
                 :ok-title="$t('game.modal.okBtn')" :cancel-title="$t('game.modal.cancelBtn')"
                 @ok="onNextLevel">
            <p>{{gameOverReason}}</p>
        </b-modal>
    </b-container>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import BlocklyEditor from "../components/editor/index.vue";
    import Game from "../components/game/index.vue";
    import {ACTION_SELECT_LEVEL, MUTATION_SET_LEVEL} from "../store/CourseProgress";

    interface LogEntry {
        line: string;
        type: string;
        color: string;
    }

    @Component({
        components: {BlocklyEditor, Game}
    })
    export default class Editor extends Vue {

        // state:
        public instructionCounter: number = 0;
        public debugLog: LogEntry[] = [];
        public showDebugLog: boolean = false;
        public gameOverReason: string = "";
        // synced:
        public blockCount: number = 0;
        public gameIsRunning: boolean = false;
        public gameIsPaused: boolean = false;

        mounted() {
            const vue = this;
            this.$store.subscribe((mutation) => {
                if (mutation.type === MUTATION_SET_LEVEL) {
                    vue.instructionCounter = 0;
                    vue.debugLog = [];
                    vue.gameOverReason = "";
                }
            })
        }

        get level() {
            return this.$store.getters.currentLevel;
        }
        get renderDebugLog() {
            return this.level ? this.level.showDebugLog : false;
        }
        get maxBlocks() {
            return this.level ? this.level.maxBlocks : Infinity;
        }

        get fullLog() {
            const copy = this.debugLog.slice();
            copy.unshift({
                type: this.$t("editor.debugLogTypes.levelDescription"),
                line: this.level.description, color: "none"
            });
            return copy;
        }

        get debugLogIcon() {
            return this.showDebugLog ? "angle-down" : "angle-up";
        }
        get logTableFields() {
            return [
                {key: "type", label: ""},
                {key: "line", label: ""}
            ];
        }

        get runButtonColor() {
            return this.gameIsRunning ? "warning" : "primary";
        }
        get runButtonText() {
            if (this.gameIsRunning) {
                if (this.gameIsPaused) {
                    return this.$t("game.continueBtnLabel");
                } else {
                    return this.$t("game.pauseBtnLabel");
                }
            } else {
                return this.$t("game.startBtnLabel");
            }
        }
        get runButtonIcon() {
            if (this.gameIsRunning) {
                if (this.gameIsPaused) {
                    return "play";
                } else {
                    return "pause";
                }
            } else {
                return "play";
            }
        }

        public runButtonClick() {
            if (this.gameIsRunning) {
                if (this.gameIsPaused) {
                    (this.$refs.game as any).continueGame();
                } else {
                    (this.$refs.game as any).pauseGame();
                }
            } else {
                const code = (this.$refs.editor as any).compile();
                console.log(`-------- ${new Date()}: Newly generated code ------\n`, code);
                (this.$refs.game as any).startGame(code);
            }
        }
        public stopButtonClick() {
            this.debugLog = [];
            this.gameOverReason = "";
            this.instructionCounter = 0;
            (this.$refs.game as any).stopAndResetGame();
        }

        // ----- GAME EVENTS -------
        public highlightBlock(blockId: string) {
            if (blockId !== null) {
                this.instructionCounter++;
            }
            (this.$refs.editor as any).highlightBlock(blockId);
        }
        public debugLogAppend(log: string, blockId: string) {
            this.debugLog.push({line: log, color: '#2e66cc', type: this.$t("editor.debugLogTypes.debugLog")});
        }
        public onGameOver(victory: boolean, reason: string) {
            this.gameOverReason = reason;
            this.debugLog.push({
                line: reason, type: this.$t("editor.debugLogTypes.gameOver"), color: victory ? "#54a928" : "#ff5f44"
            });
            if (victory) {
                (this.$refs.gameOverModal as any).show();
            }
        }
        public onNextLevel() {
            // TODO this could be easier... use vuex-router-sync?
            if (this.$store.getters.hasNextLevel) {
                const nextLevel = this.$store.state.CourseProgressModule.currentLevel + 1;
                this.$store.dispatch(ACTION_SELECT_LEVEL, nextLevel);
                this.$router.push(`/lessons/${this.$route.params["lessonId"]}/levels/${nextLevel}`);
            } else {
                this.$router.push('/lessons')
            }
        }

    }
</script>

<style lang="scss">
    .no-header {
        display: none;
    }
    .header-spacing {
        margin-top: 20px;
    }
    .stat-row {
        margin-top: 4px;
    }
    .control-row {
        margin-top: 20px;

        .game-control-btn {
            margin: 0 2px;
        }
    }
    .overlay {
        border-top: 1px solid #ccc;
        padding-left: 10px;
        position: fixed;
        z-index: 1000;
        bottom: 0;
        left: 0;
        right: 0;

        .scrollable {
            background-color: white;
            height: 150px;
            overflow-y: scroll;
        }
    }
</style>