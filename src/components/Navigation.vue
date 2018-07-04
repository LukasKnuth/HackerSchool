<template>
    <b-navbar toggleable="md" type="dark" variant="dark">
        <b-navbar-brand to="/">HackerSchool</b-navbar-brand>
        <b-collapse is-nav id="nav_collapse">
            <b-navbar-nav>
                <b-nav-item v-for="link in leftLinks" :key="link.path" @click="gotoRoute(link)">
                    {{$t(link.i18nKey)}}
                </b-nav-item>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto">
                <b-nav-item v-for="link in rightLinks" :key="link.path" @click="gotoRoute(link)">
                    {{$t(link.i18nKey)}}
                </b-nav-item>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";

    interface Link {
        i18nKey: string;
        path: string;
    }

    @Component
    export default class Navigation extends Vue {

        public leftLinks: Link[] = [
            {i18nKey: "navigation.lessonsLabel", path: "/lessons"}
        ];
        public rightLinks: Link[] = [
            {i18nKey: "navigation.aboutLabel", path: "/about"}
        ];

        public gotoRoute(link: Link) {
            this.$router.push(link.path);
        }

    }
</script>