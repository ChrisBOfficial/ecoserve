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
                    <b-button href="https://login.qualtrics.com/login">Link to Qualtrics</b-button>
                </b-row>
                <b-row>
                    <survey-blocks ref="surveyInfo" v-bind:questions="questions"/>
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
import ProjectForm from '@/components/ProjectForm.vue'
import VisualizationDashboard from '@/components/VisualizationDashboard.vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import surveyBlocks from '@/components/surveyBlocks.vue'
var request = require('request');


export default{
    components:{
        ProjectForm,
        VisualizationDashboard,
        Header, 
        Footer,
        surveyBlocks
    },
    data(){
        return{
            title: '',
            description:'',
            blocks: {},
            questions: []
        }
    },

    methods:{
        createProject: function(event){
            const payload = {
                "projectTitle": this.title,
                "description": this.description,
                "surveyID" : this.$refs.surveyInfo.selectedSurvey.id,
                "blocks" : this.$refs.allData.allBlocks      
            }
            console.log(payload)
        }
        

    }
}
</script>