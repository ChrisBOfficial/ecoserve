<template>
    <div class='new-project-container'>
        <Header/>
            <b-container>
                <b-row class="h-100">
                    <h1 aria-placeholder="CREATE NEW PROJECT"> {{title}} </h1>
                </b-row>
                <b-row>
                    <b-form-input v-model="title" placeholder="Enter Project Title"></b-form-input>
                    <b-form-input v-model="description" placeholder="Enter Project Description"></b-form-input>
                </b-row>
                <b-row>
                    <h3>Create New Survey</h3>
                </b-row>
                <b-row class="align-items-center">
                    <b-button href="https://login.qualtrics.com/login" target="_blank">Link to Qualtrics</b-button>
                </b-row>
                <b-row>
                    <survey-blocks/>
                </b-row>
                <b-row>
                    <h2> Visualization Dashboard </h2>
                    <visualization-dashboard/>
                </b-row>

                <b-row align-h="center">
                    <b-col class="col-4 text-center align-items-center">
                        <b-button v-on:click="createProject" style="background-color:DarkSeaGreen;" v-b-modal.modal-center>CREATE PROJECT</b-button>
                        <b-modal id="modal-center" centered :hide-header="true" ok-only v-on:ok="exitEditing">
                            <p class="my-4">Project created!</p>
                        </b-modal>
                    </b-col>
                </b-row>
            </b-container>
        <Footer/>
    </div>
</template>


<script>
import VisualizationDashboard from '@/components/VisualizationDashboard.vue';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import surveyBlocks from '@/components/surveyBlocks.vue';
import {mapActions, mapState} from 'vuex';

export default {
    components: {
        Header, 
        Footer,
        VisualizationDashboard,
        surveyBlocks
    },
    data() {
        return {
            title: '',
            description: ''
        }
    },
    computed: {
        ...mapState({
            survey: state => state.surveys.survey,
            projectBlocks: state => state.projects.projectBlocks,
        })
    },
    methods: {
        ...mapActions({
            loadSurveys: 'surveys/loadSurveys',
            loadSurvey: 'surveys/loadSurvey',
            saveProject: 'projects/saveProject'
        }),
        createProject: function() {
            const payload = {
                name: this.title,
                description: this.description,
                surveyId : this.survey.id,
                projectId: this.title + "+" + this.survey.id,
                blocks : this.projectBlocks,
                hooked: false
            };
            this.saveProject(payload);
        },
        exitEditing: function() {
            this.$router.push('project');
        }
    }
}
</script>