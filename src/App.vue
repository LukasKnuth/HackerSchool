<template>
  <div id="app">
    <navigation />
    <b-container fluid class="bv-example-row">
      <b-row class="justify-content-sm-center">
        <router-view/>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
    // Import CSS from bootstrap
    import "bootstrap/dist/css/bootstrap.css";
    import "bootstrap-vue/dist/bootstrap-vue.css";
    // Import base-components:
    import {Component, Vue} from "vue-property-decorator";
    import Navigation from "./components/Navigation.vue";

    @Component({
        components: {
            Navigation
        },
    })
    export default class App extends Vue {}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
