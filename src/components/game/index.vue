<template>
    <div id="game-window"></div>
</template>

<script lang="ts">
    import * as pixi from "pixi.js";
    import "pixi-sound";
    import {Component, Vue, Prop, Watch} from "vue-property-decorator";
    import * as game from "./Game";
    import {Level} from "../../content/Lesson";
    import {GameLoop, GameResources} from "./Game";
    import {GameState} from "./GameState";

    @Component
    export default class Game extends Vue {

        @Prop()
        public level?: Level;

        private engine?: pixi.Application;
        private gameLoop?: GameLoop;
        private resources?: GameResources;

        private mounted() {
            this.engine = new pixi.Application({
                width: 280, height: 280, antialias: true
            });
            this.$el.appendChild(this.engine.view);

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
            this.renderPreview();
        }

        private renderPreview() {
            this.stopGame();
            const [engine, level] = [this.engine, this.level];
            if (engine && level) {
                game.renderPreview(engine, level, this.frameRenderer.bind(this));
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

        public startGame(userCode: string) {
            this.stopGame();
            const [engine, level] = [this.engine, this.level];
            if (engine && level) {
                this.gameLoop = game.startGameLoop(engine, level, userCode, this.frameRenderer.bind(this));
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
            this.$emit("game-over", victory, reason);
        }

    }
</script>