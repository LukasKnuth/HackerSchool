<template>
    <b-navbar toggleable="md" type="dark" variant="dark">
        <b-navbar-brand href="#">HackerSchool</b-navbar-brand>
        <b-collapse is-nav id="nav_collapse">
            <b-navbar-nav>
                <b-nav-item v-for="link in links" :key="link.path" @click="gotoRoute(link)">{{link.label}}</b-nav-item>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";

    interface Link {
        label: string;
        path: string;
    }

    @Component
    export default class Navigation extends Vue {

        public links: Link[] = [
            {label: "Home", path: "/"},
            {label: "About", path: "/about"},
            {label: "Editor", path: "/editor"}
        ];

        public gotoRoute(link: Link) {
            this.$router.push(link.path);
        }

    }
</script>