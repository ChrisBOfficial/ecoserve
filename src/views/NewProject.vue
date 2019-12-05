<template>
    <div class='new-project-container'>
        <Header/>
        <ProjectForm
        />
        <button onclick="https://login.qualtrics.com/login">Link to Qualtrics</button>

        <h1> Add code for existing Qualtrics surveys </h1>

        <VisualizationDashboard/>


        <Footer/>
    </div>
</template>


<script>
import ProjectForm from '@/src/components/ProjectForm.vue'
import VisualizationDashboard from '@/src/components/VisualizationDashboard.vue'
import Header from '@/src/components/Header.vue'
import Footer from '@/src/components/Footer.vue'

export default{
    components:{
        ProjectForm
    },
    data(){
        return{}
    }
}
</script>