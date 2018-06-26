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

        private mounted() {
            this.engine = new pixi.Application({
                width: 280, height: 280, antialias: true
            });
            this.$el.appendChild(this.engine.view);

            this.engine.ticker.autoStart = false;
            this.engine.renderer.autoResize = true; // TODO stretch to full available width of container

            game.initializeRenderer(this.engine).then((sprites: GameSprites) => {
                this.sprites = sprites;
            }).catch((err) => {
                console.error(err); // TODO show error in UI!
            });
        }

        public startGame(userCode: string) {
            this.stopGame();
            const [engine, sprites, level] = [this.engine, this.sprites, this.level];
            if (engine && sprites && level) {
                this.gameLoop = game.startGameLoop(engine, level, userCode, (state: GameState) => {
                    game.renderFrame(engine, sprites, state);
                }, (blockId: string) => this.$emit("block-executed", blockId));
                this.$emit("update:running", true); // TODO Add automatic emit when code ends!
            } else {
                console.error("Can't start game, something is not initialized!", engine, sprites, level);
            }
        }

        public stopGame() {
            if (this.engine && this.gameLoop) {
                game.stopGameLoop(this.engine, this.gameLoop);
                this.$emit("update:running", false);
            }
        }

    }
</script>