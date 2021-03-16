import Vue from "vue";
import Router from "vue-router";
import HelloWorld from "@/components/HelloWorld";
import MainPanel from "@/components/MainPanel";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/hello",
      name: "HelloWorld",
      component: HelloWorld
    },
    {
      path: "/",
      name: "MainPanel",
      component: MainPanel
    }
  ]
});
