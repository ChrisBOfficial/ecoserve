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
                    <visualization-dashboard ref="allData"/>
                </b-row>

                <b-row>
                    <b-col>
                        <button v-on:click="createProject" style="background-color:DarkSeaGreen;">CREATE PROJECT</button>
                    </b-col>
                    <b-col>
                        <button style="background-color:DarkSeaGreen;">DELETE PROJECT</button>
                    </b-col>
                </b-row>
            </b-container>
        <Footer/>
    </div>
</template>


<script>
import VisualizationDashboard from '@/components/VisualizationDashboard.vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import surveyBlocks from '@/components/surveyBlocks.vue'
import {mapActions, mapState} from 'vuex';
import io from 'socket.io-client';

export default {
    components: {
        Header, 
        Footer,
        VisualizationDashboard,
        surveyBlocks
    },
    data() {
        return {
            socket: io('localhost:3000'),
            title: '',
            description:'',
            questions: []
        }
    },
    computed: {
        ...mapState({
            surveys: state => state.surveys.surveys,
            survey: state => state.surveys.survey,
            blocks: state => state.surveys.blocks,
            projectBlocks: state => state.surveys.projectBlocks
        })
    },
    mounted() {
        this.socket.on('realtime', function(msg) {
            console.log('message: ' + msg);
        });
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
                data: {
                    "description": this.description,
                    "surveyID" : this.survey.id,
                    "blocks" : this.projectBlocks 
                }     
            };
            this.saveProject(payload);
        }
    }
}
</script>