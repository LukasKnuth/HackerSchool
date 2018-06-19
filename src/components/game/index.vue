<template>
    <div id="game-window"></div>
</template>

<script lang="ts">
    import * as pixi from "pixi.js";
    import {Component, Vue, Prop} from "vue-property-decorator";
    import * as game from "./Game";
    import {Level} from "../../content/Lesson";
    import {GameLoop} from "./Game";
    import {GameState} from "./GameState";

    @Component
    export default class Game extends Vue {

        @Prop()
        public level: Level;

        private engine: pixi.Application;
        private gameLoop: GameLoop;

        private mounted() {
            this.engine = new pixi.Application({
                width: 280, height: 280, antialias: true
            });
            this.$el.appendChild(this.engine.view);

            this.engine.renderer.autoResize = true; // TODO stretch to full available width of container

            game.initializeRenderer(this.engine).catch((err) => {
                console.error(err); // TODO show error in UI!
            })
        }

        public startGame(userCode: string) {
            this.stopGame();
            this.gameLoop = game.startGameLoop(this.engine, this.level, userCode, (state: GameState) => {
                game.renderFrame(state);
            });
        }

        public stopGame() {
            if (this.gameLoop) {
                game.stopGameLoop(this.engine, this.gameLoop);
            }
        }

    }
</script>