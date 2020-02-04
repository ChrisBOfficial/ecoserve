<template>

    <div class='existing-project-container'>
        <Header/>
        

        <b-container v-show="seen">
            <b-row>
                <h3>Choose a project: </h3> 
                <b-form-select v-model="selected" :select-size="4">
                    <option v-for="project in projects" :value="project" :key="project">
                        {{project.name}}
                    </option>
                </b-form-select>
            </b-row>
            <b-row>
                <button v-on:click="projectPicked = !projectPicked; seen = !seen">Choose project</button>
            </b-row>
        </b-container>



        <b-container v-show="projectPicked">
            <b-row class="h-100">
                <h1 aria-placeholder="CREATE NEW PROJECT"> {{title}} </h1>
            </b-row>
            <b-row>
                <b-form-input v-model="title" placeholder="Enter Project Title"></b-form-input>
                <b-form-input v-model="description" placeholder="Enter Project Description"></b-form-input>
            </b-row>
            <b-row>
                <h3>Survey: insert survey name</h3>
                <button> Link to Survey </button>
            </b-row>
            <b-row>
                <h2> Visualization Dashboard </h2>
                <visualization-dashboard ref="allData"/>
            </b-row>


            <b-row>
                <b-col>
                    <b-button v-on:click="createProject" style="background-color:DarkSeaGreen;">SAVE PROJECT</b-button>
                </b-col>
                <b-col>
                    <b-button style="background-color:DarkSeaGreen;" v-b-modal.modal>DELETE PROJECT</b-button>
                    <b-modal id="modal" title="Warning">
                        <p class="my-4">Are you sure you want to delete the project?</p>
                    </b-modal>
                </b-col>
                <b-col>
                    <router-link to="/visualizationpage" tag="button" style="background-color:DarkSeaGreen;">Go To Visualization</router-link>
                </b-col>
            </b-row>
        </b-container>


        <Footer/>
    </div>
</template>

<script>
    import {mapActions, mapState} from 'vuex'

	import ProjectForm from '@/components/ProjectForm.vue'
	import VisualizationDashboard from '@/components/VisualizationDashboard.vue'
	import Header from '@/components/Header.vue'
	import Footer from '@/components/Footer.vue'
    import SurveyBlocks from '@/components/surveyBlocks.vue'
    
    export default{
        name: "existingProject",
        components: {
			ProjectForm,
			VisualizationDashboard,
			Header,
			Footer,
			SurveyBlocks
		},
        data(){
            return {
                projectPicked: false,
                //json: require('../data/projects.json') 
                //projects: getAllProjects()
                seen: true
            }
        },

        computed: {
			...mapState({
				projects: state => state.projects.projects
			})
        },
        created: function() {
            this.loadProjects();
        },
        
        methods: {
			...mapActions({
                loadProjects: 'projects/loadProjects',
                saveProject: 'projects/saveProject'
			})
		}
        //computed :{
        //    ...mapGetters([
        //        'getAllProjects'
        //    ])
        //}

        //created(){
        //    const vm = this;
        //    vm.getAllProjects();
        //}

    }
    
</script>
