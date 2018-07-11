<template>
    <b-container id="lessons">
        <b-row>
            <b-col v-for="l in lessons" :key="l.id" cols="4">
                <b-card :title="l.lesson.name"
                        class="mb-2"
                        :img-src="getImageSource(l)"
                        :img-alt="l.lesson.name"
                        img-top>
                    <p class="card-text">{{l.lesson.description}}</p>
                    <b-button :variant="getButtonVariant(l)"
                              @click="startLevel(l.id)">{{getButtonText(l)}}</b-button>
                </b-card>
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {ACTION_SELECT_LESSON, LessonListEntry} from "../store/CourseProgress";

    @Component
    export default class Lessons extends Vue {
        get lessons() {
            return this.$store.getters.lessons;
        }
        getButtonText(entry: LessonListEntry) {
            return entry.hasProgress ? this.$t("lessons.continueLessonLabel") : this.$t("lessons.startLessonLabel");
        }
        getButtonVariant(entry: LessonListEntry) {
            return entry.hasProgress ? "success" : "primary"
        }
        getImageSource(entry: LessonListEntry) {
            return `${BASE_URL}lessons/${entry.id}.png`;
        }

        startLevel(lessonId: string) {
            this.$store.dispatch(ACTION_SELECT_LESSON, lessonId);
            this.$router.push(`/lessons/${lessonId}/levels/`);
        }
    }
</script>

<style lang="scss">
    #lessons {
        margin-top: 20px;
    }
</style>
