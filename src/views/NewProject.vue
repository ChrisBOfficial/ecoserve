<template>
    <div class='new-project-container'>
        <Header/>
            <b-container>
                <b-row class="h-100">
                    <h1> CREATE NEW PROJECT </h1>
                    <project-form/>
                </b-row>
                <b-row class="align-items-center">
                    <b-button href="https://login.qualtrics.com/login">Link to Qualtrics</b-button>
                </b-row>
                <b-row>
                    <h1> Add code for existing Qualtrics surveys </h1>

                    <visualization-dashboard/>
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
        return{}
    }
}
</script>