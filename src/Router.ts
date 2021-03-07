import Vue from "vue";
import VueRouter from "vue-router";
import UserList from "@/pages/UserList.vue";
import CategoryList from "@/pages/CategoryList.vue";
import CategoryDetails from "@/pages/CategoryDetails.vue";
import ItemDetails from "@/pages/ItemDetails.vue";
import Login from "@/pages/Login.vue";

Vue.use(VueRouter);

export const router = new VueRouter({
  routes: [
    {
      path: "/users",
      name: "UserList",
      component: UserList
    },
    {
      path: "/categories",
      name: "CategoryList",
      component: CategoryList
    },
    {
      path: "/category/:id/:tab?",
      name: "CategoryDetails",
      component: CategoryDetails
    },
    {
      path: "/item/:categoryId/:id/:tab?",
      name: "ItemDetails",
      component: ItemDetails
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "*",
      component: Login
    }
  ]
});
