<template>
    <div>
        <Header />
        <section class="masthead-2">
            <b-container style="padding: 15vh 0vh 0vh 0vh;">
                <b-row class="h-100 align-items-center">
                    <b-col class="col-6 text-center align-items-center" id="ProjectList">
                        <h3>PROJECTS</h3>
                        <b-col>
                            <ProjectDescription
                                v-for="project in projects"
                                :key="project.projectId"
                                v-bind:project="project"
                            ></ProjectDescription>
                        </b-col>
                        <br />

                        <b-row>
                            <div class="col-md-6">
                                <router-link to="/newproject" tag="b-button" style="background-color:DarkSeaGreen;"
                                    >Create new project</router-link
                                >
                            </div>
                            <div class="col-md-6 col-md-offset-6">
                                <router-link to="/existingproject" tag="b-button" style="background-color:DarkSeaGreen;"
                                    >Edit existing project</router-link
                                >
                            </div>
                        </b-row>
                    </b-col>

                    <b-col class="col-6 text-center align-items-center">
                        <img src="@/assets/jon.jpg" alt="Project image" class="thumb" />
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
    created: function() {
        window.scrollTo(0, 0);
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
@import "../assets/fonts/css/all.css";
@import "https://fonts.googleapis.com/css?family=Varela+Round";
@import "https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i";
</style>
