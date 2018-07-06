<template>
    <b-container>
        <div id="game-window"></div>
        <b-row id="game-controls" align-v="end">
            <b-col><label for="game-speed">{{$t("game.controls.speedSliderLabel")}}</label></b-col>
            <b-col>
                <!-- todo move this out of here to the other game-related controls in the editor! -->
                <b-form-input id="game-speed" type="range"
                              :min="minGameSpeed" :max="maxGameSpeed"
                              v-model.number="gameSpeed"></b-form-input>
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
    import * as pixi from "pixi.js";
    import "pixi-sound";
    import {Component, Vue, Prop, Watch} from "vue-property-decorator";
    import * as game from "./Game";
    import {Level} from "../../content/Lesson";
    import {GameLoop, GameResources} from "./Game";
    import {GameState} from "./GameState";
    import {ACTION_CHANGE_LEVEL_PROGRESS} from '../../store/CourseProgress';

    const GAME_SPEED_FAST = 100;
    const GAME_SPEED_SLOW = 1000;

    @Component
    export default class Game extends Vue {

        @Prop()
        public level?: Level;

        public gameSpeed: number = GAME_SPEED_SLOW;

        private engine?: pixi.Application;
        private gameLoop?: GameLoop;
        private resources?: GameResources;

        private mounted() {
            this.engine = new pixi.Application({
                width: 280, height: 280, antialias: true
            });
            this.$el.querySelector("#game-window").appendChild(this.engine.view);

            this.engine.ticker.autoStart = false;
            this.engine.renderer.autoResize = true; // TODO stretch to full available width of container

            game.initializeRenderer(this.engine).then((resources: GameResources) => {
                this.resources = resources;
                this.renderPreview();
            }).catch((err) => {
                console.error(err); // TODO show error in UI!
            });
        }
        private beforeDestroy() {
            if (this.engine) {
                this.engine.destroy(true);
            }
        }

        @Watch("level")
        private onLevelChange(){
            this.stopGame();
            if (this.resources) {
                // this prevents a race-condition with game.initializeRenderer() when the page is first created!
                this.renderPreview();
            }
        }

        private renderPreview() {
            this.stopGame();
            const [engine, level] = [this.engine, this.level];
            if (engine && level) {
                game.renderPreview(engine, level, this.frameRenderer.bind(this));
                engine.render();
            }
        }
        private frameRenderer(state: GameState) {
            const [engine, resources] = [this.engine, this.resources];
            if (engine && resources) {
                game.renderFrame(engine, resources, state);
            } else {
                console.log("Couldn't render frame, something is not initialized", engine, resources);
            }
        }

        get maxGameSpeed() {
            return GAME_SPEED_SLOW; // TODO this is weird, because if the control is fully right, game-speed isn't max!
        }
        get minGameSpeed() {
            return GAME_SPEED_FAST;
        }
        @Watch("gameSpeed")
        private onGameSpeedChanged() {
            if (this.gameLoop) {
                this.gameLoop.tickWait = this.gameSpeed;
            }
        }
        public startGame(userCode: string) {
            this.stopGame();
            const [engine, level] = [this.engine, this.level];
            if (engine && level) {
                this.gameLoop = game.startGameLoop(engine, level, userCode, this.frameRenderer.bind(this), this.gameSpeed);
                this.gameLoop.onBlockExecuting = (blockId: string) => this.emitBlockExecuting(blockId);
                this.gameLoop.onGameTerminated = () => {
                    console.log("User Code has no more steps to execute!");
                    this.stopGame();
                    this.emitRunningUpdate(false);
                };
                this.gameLoop.onGameOver = (victory: boolean, reason: string) => this.emitGameOver(victory, reason);
                this.gameLoop.onDebugLog = (log: string, blockId: string) => this.emitLogAppend(log, blockId);
                this.emitRunningUpdate(true);
            } else {
                console.error("Can't start game, something is not initialized!", engine, level);
            }
        }
        public stopGame() {
            if (this.engine && this.gameLoop) {
                game.stopGameLoop(this.engine, this.gameLoop);
                this.emitRunningUpdate(false);
            }
        }
        public pauseGame() {
            if (this.engine && this.gameLoop) {
                this.gameLoop.isPaused = true;
                this.emitPausedUpdate(true)
            }
        }
        public continueGame() {
            if (this.engine && this.gameLoop) {
                this.gameLoop.isPaused = false;
                this.emitPausedUpdate(false)
            }
        }

        private emitPausedUpdate(isPaused: boolean) {
            this.$emit("update:paused", isPaused);
        }
        private emitRunningUpdate(isRunning: boolean) {
            if (!isRunning) {
                // this clears the highlighting in the editor
                this.emitBlockExecuting(null);
            }
            this.$emit("update:running", isRunning);
        }
        private emitBlockExecuting(blockId: string|null) {
            this.$emit("block-executing", blockId);
        }
        private emitLogAppend(log: string, blockId: string) {
            this.$emit("debug-log-append", log, blockId);
        }
        private emitGameOver(victory: boolean, reason: string) {
            if (victory) {
                this.$store.dispatch(ACTION_CHANGE_LEVEL_PROGRESS, {
                    isFinished: victory
                });
            }
            this.$emit("game-over", victory, reason);
        }

    }
</script>

<style lang="scss">
    #game-speed {
        // Rotate, so the speed increases from left to right. This wouldn't work by flipping values because min must
        // be larger than max...
        transform: rotate(180deg);
    }
</style>