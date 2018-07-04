import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import About from './views/About.vue';
import Editor from "./views/Editor.vue";
import Lessons from "./views/Lessons.vue";
import Level from "./views/Level.vue";

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
          path: '/lessons',
          name: 'lessons',
          component: Lessons
      },
      {
          path: '/lessons/:lessonId/levels/',
          component: Level,
          children: [{
              path: '',
              redirect: '0'
          },{
              path: ':levelId',
              component: Editor
          }]
      }
  ],
});
