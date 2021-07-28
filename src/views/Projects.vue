<template>
    <div>
        <Header />
        <section class="masthead-2">
            <b-container style="padding: 180px 0 0 0;">
                <b-row class="h-100">
                    <b-col class="col-6 text-center align-items-center" id="ProjectList">
                        <h3>PROJECTS</h3>
                        <b-col style="padding-top: 15px;">
                            <ProjectDescription
                                v-for="project in projects"
                                :key="project.projectId"
                                v-bind:project="project"
                            ></ProjectDescription>
                        </b-col>
                        <br />

                        <b-row>
                            <div class="col-md-12">
                                <router-link to="/newProject" tag="b-button" style="background-color:DarkSeaGreen;"
                                    >Create new project</router-link
                                >
                            </div>
                        </b-row>
                    </b-col>

                    <b-col class="col-6 text-center align-items-center">
                        <img src="@/assets/projects.png" alt="Your projects" class="thumb" />
                    </b-col>
                </b-row>
            </b-container>
        </section>
        <Footer />
    </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import ProjectDescription from "@/components/ProjectDescription.vue";
import { mapMutations, mapState, mapActions } from "vuex";

export default {
    name: "ProjectList",
    components: {
        Header,
        Footer,
        ProjectDescription
    },
    computed: {
        ...mapState({
            projects: state => state.projects.projects
        })
    },
    async created() {
        window.scrollTo(0, 0);
        if (!window.axios.defaults.headers["x-api-token"] && !window.axios.defaults.headers["q-data-center"]) {
            await new Promise(r => setTimeout(r, 550));
        }
        this.loadProjects();
        this.setBlocks([]);
    },
    methods: {
        ...mapActions({
            loadProjects: "projects/loadProjects"
        }),
        ...mapMutations({
            setBlocks: "surveys/setSurveyBlocks"
        })
    }
};
</script>

<style scoped>
@import "../assets/grayscale.css";
</style>
