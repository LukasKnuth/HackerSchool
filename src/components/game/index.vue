<template>
    <div id="game-window"></div>
</template>

<script lang="ts">
    import * as pixi from "pixi.js";
    import {Component, Vue} from "vue-property-decorator";
    import * as game from "./Game";

    @Component
    export default class Game extends Vue {
        private mounted() {
            const app = new pixi.Application({
                width: 280, height: 280, antialias: true
            });
            this.$el.appendChild(app.view);

            app.renderer.autoResize = true; // TODO stretch to full available width of container

            this.initializeGame(app).catch((err) => {
                console.error(err); // TODO show error in UI!
            })
        }

        private async initializeGame(app: pixi.Application) {
            const sprites = await game.loadSprites(app);
            app.stage.addChild(sprites.background);
            app.stage.addChild(sprites.player1);

            sprites.player1.position.set(40, 100);
            sprites.player1.scale.set(0.25, 0.25);

        }
    }
</script>