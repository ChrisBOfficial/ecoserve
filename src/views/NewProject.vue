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
                <b-row class="align-items-center">
                    <b-button href="https://login.qualtrics.com/login">Link to Qualtrics</b-button>
                </b-row>
                <b-row>
                    <h1> Add code for existing Qualtrics surveys </h1>

                    <visualization-dashboard/>
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
var request = require('request');


export default{
    components:{
        ProjectForm,
        VisualizationDashboard,
        Header, 
        Footer
    },
    data(){
        return{
            title: '',
            description:'',
        }
    },

    methods:{
        createProject: function(event){
            const payload = {
                title :{
                    "description": this.description,
                    "surveyID" : '',
                    "blocks" : VisualizationDashboard.allBlocks
                }
            }
            console.log(payload)
        }

    }
}
</script>