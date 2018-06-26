<template>
    <div id="game-window"></div>
</template>

<script lang="ts">
    import * as pixi from "pixi.js";
    import {Component, Vue, Prop} from "vue-property-decorator";
    import * as game from "./Game";
    import {Level} from "../../content/Lesson";
    import {GameLoop, GameSprites} from "./Game";
    import {GameState} from "./GameState";

    @Component
    export default class Game extends Vue {

        @Prop()
        public level?: Level;

        private engine?: pixi.Application;
        private gameLoop?: GameLoop;
        private sprites?: GameSprites;

        private mounted() { // TODO need to do cleanup? (in unmount?) What when we change levels?
            this.engine = new pixi.Application({
                width: 280, height: 280, antialias: true
            });
            this.$el.appendChild(this.engine.view);

            this.engine.ticker.autoStart = false;
            this.engine.renderer.autoResize = true; // TODO stretch to full available width of container

            game.initializeRenderer(this.engine).then((sprites: GameSprites) => {
                this.sprites = sprites;
                this.renderPreview();
            }).catch((err) => {
                console.error(err); // TODO show error in UI!
            });
        }
        private updated() {
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
            const [engine, sprites] = [this.engine, this.sprites];
            if (engine && sprites) {
                game.renderFrame(engine, sprites, state);
            } else {
                console.log("Couldn't render frame, something is not initialized", engine, sprites);
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

    }
</script>