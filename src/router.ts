import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import About from './views/About.vue';
import Editor from "./views/Editor.vue";
import Lessons from "./views/Lessons.vue";

Vue.use(Router);

export default new Router({
  routes: [
      {
          path: '/',
          name: 'home',
          component: Home,
      },
      {
          path: "/about",
          name: "about",
          component: About
      },
      {
          path: '/editor',
          name: 'editor',
          component: Editor
      },
      {
          path: '/lessons',
          name: 'lessons',
          component: Lessons
      }
  ],
});
