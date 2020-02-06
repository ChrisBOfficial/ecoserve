<template>
    <div>
        <Header/>
        <section class="masthead-2">
            <b-container>
                <b-row class="h-100 align-items-center">
                    <b-col class="col-6 text-center align-items-center" id="ProjectList">
                        <h3>PROJECTS</h3>
                        <b-row>
                            <div class="col-md-6">
                                <router-link to="/newproject" tag="button" style="background-color:DarkSeaGreen;">Create new project</router-link>
                            </div>
                            <div class="col-md-6 col-md-offset-6">
                                <router-link to="/existingproject" tag="button" style="background-color:DarkSeaGreen;">Edit existing project</router-link>
                            </div>
                        </b-row>
                        <br/>

                        <b-col class="col-md-11 position-absolute">
                            <ProjectDescription v-for="project in projects" :key="project.surveyId" v-bind:project="project"></ProjectDescription>
                        </b-col>
                    </b-col>

                    <b-col class="col-6 text-center align-items-center">
                        <img src="@/assets/jon.jpg" alt="Project image" class="thumb">
                    </b-col>
                </b-row>    
            </b-container>
        </section>
        <Footer/>
    </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import ProjectDescription from '@/components/ProjectDescription.vue'
import { mapMutations, mapState, mapActions } from 'vuex'

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
        this.loadProjects();
        this.setBlocks([]);
    },
    methods: {
        ...mapActions({
            loadProjects: 'projects/loadProjects'
        }),
        ...mapMutations({
            setBlocks: 'surveys/setSurveyBlocks'
        })
    }
}
</script>


