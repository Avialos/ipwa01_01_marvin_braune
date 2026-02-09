import { createRouter, createWebHistory } from "vue-router";

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: () => import ('../views/HomeView.vue')},
        { path: '/registrierung', component: () => import('../views/RegistrationView.vue')},
        { path: '/bestaetigung', component: () => import('../views/ConfirmationView.vue')},
        { path: '/impressum', component: () => import('../views/ImprintView.vue')},
        { path: '/datenschutz', component: () => import('../views/PrivacyView.vue')},
    ]
})