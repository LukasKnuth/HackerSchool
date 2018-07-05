<template>
    <b-container>
        <b-row>
            <b-col cols="4">
                <game ref="game" :level="level"
                      @block-executing="highlightBlock"
                      @debug-log-append="debugLogAppend"
                      @game-over="onGameOver"
                      :running.sync="gameIsRunning"
                />
                <b-container>
                    <b-row class="gameover-row" v-if="gameOverReason">
                        <b-col cols="4">{{$t("game.stats.gameOverLabel")}}</b-col>
                        <b-col>{{gameOverReason}}</b-col>
                    </b-row>
                    <b-row class="stat-row">
                        <b-col cols="5">{{$t("game.stats.instructionCounterLabel")}}</b-col>
                        <b-col>{{instructionCounter}}</b-col>
                    </b-row>
                    <b-row class="stat-row">
                        <b-col cols="5">{{$t("game.stats.blocksCounterLabel")}}</b-col>
                        <b-col>{{blockCount}} / {{maxBlocks}}</b-col>
                    </b-row>
                    <b-row class="control-row" align-h="center">
                        <b-col cols="5">
                            <b-button :variant="runButtonColor" @click="runButtonClick">{{runButtonText}}</b-button>
                        </b-col>
                    </b-row>
                </b-container>
                <h3 class="header-spacing">{{$t("game.level.descriptionHeadline")}}</h3>
                <p>{{description}}</p>
            </b-col>
            <b-col cols="8" id="blocklyArea">
                <blockly-editor ref="editor"
                                :level="level"
                                :blocks.sync="blockCount"
                />
            </b-col>
        </b-row>
        <div class="overlay" v-if="renderDebugLog">
            <div class="preview">
                <h3 class="peek" @click="showDebugLog = !showDebugLog">
                    <font-awesome-icon :icon="debugLogIcon" />
                    <span class="title">{{$t("editor.debugLog.sliderLabel")}}</span>
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

    interface DebugLogEntry {
        line: string;
        blockId: string;
        instruction: number;
    }

    @Component({
        components: {BlocklyEditor, Game}
    })
    export default class Editor extends Vue {

        public instructionCounter: number = 0;
        public gameIsRunning: boolean = false;
        public blockCount: number = 0;
        public debugLog: DebugLogEntry[] = [];
        public showDebugLog: boolean = false;
        public gameOverReason: string = "";

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
        get description() {
            return this.level ? this.level.description : "";
        }

        get debugLogIcon() {
            return this.showDebugLog ? "angle-down" : "angle-up";
        }
        get logTableFields() {
            return [
                {key: "line", label: this.$t("editor.debugLog.headerOutput")},
                {key: "instruction", label: this.$t("editor.debugLog.headerInstruction")}
            ];
        }

        get runButtonColor() {
            return this.gameIsRunning ? "danger" : "primary";
        }
        get runButtonText() {
            return this.gameIsRunning ? this.$t("game.stopBtnLabel") : this.$t("game.startBtnLabel");
        }

        public runButtonClick() {
            if (this.gameIsRunning) {
                (this.$refs.game as any).stopGame();
            } else {
                this.debugLog = [];
                this.gameOverReason = "";
                this.instructionCounter = 0;
                const code = (this.$refs.editor as any).compile();
                console.log(`-------- ${new Date()}: Newly generated code ------\n`, code);
                (this.$refs.game as any).startGame(code);
            }
        }

        // ----- GAME EVENTS -------
        public highlightBlock(blockId: string) {
            if (blockId !== null) {
                this.instructionCounter++;
            }
            (this.$refs.editor as any).highlightBlock(blockId);
        }
        public debugLogAppend(log: string, blockId: string) {
            this.debugLog.push({line: log, blockId, instruction: this.instructionCounter});
        }
        public onGameOver(victory: boolean, reason: string) {
            this.gameOverReason = reason;
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

        // ----- DEBUG LOG EVENTS ---
        public onLogHover(item: DebugLogEntry) {
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
    .gameover-row {
        color: red;
    }
    .overlay {
        padding: 0 20px;
        position: fixed;
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