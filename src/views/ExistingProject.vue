<template>
    <div class='existing-project-container'>
        <Header/>
        <b-container v-show="seen">
            <b-row>
                <b-form-select v-model="selected" :select-size="5">
                    <option v-for="project in projects" :value="project" :key="project.name">
                        {{project.name}}
                    </option>
                </b-form-select>
            </b-row>
            <b-row>
                <button v-on:click="selectProject" style="background-color:DarkSeaGreen;">
                    Choose project
                </button>
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
                <button style="background-color:DarkSeaGreen;"> Link to Survey </button>
            </b-row>
            <b-row>
                <h2> Visualization Dashboard </h2>
                <visualization-dashboard ref="allData" v-bind:existing-visualizations="visualizations" v-bind:existing-blocks="existingBlocks"/>
            </b-row>

            <b-row>
                <b-col>
                    <b-button v-on:click="createProject" style="background-color:DarkSeaGreen;">SAVE PROJECT</b-button>
                </b-col>
                <b-col>
                    <b-button style="background-color:DarkSeaGreen;" v-b-modal.modal-1>DELETE PROJECT</b-button>
                    <b-modal id="modal-1" title="Warning">
                        <p class="my-4">Are you sure you want to delete the project?</p>
                    </b-modal>
                </b-col>
                <b-col>
                    <router-link :to="{ name: 'dashboard', query: { id:selected.projectId }}" tag="b-button" style="background-color:DarkSeaGreen;">Go To Visualization</router-link>
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
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import {mapActions, mapState, mapMutations} from 'vuex'


export default {
    components: {
        Header,
        VisualizationDashboard,
        Footer
    },
    data() {
        return {
            projectPicked: false,
            seen: true,
            selected: {},
            visualizations: [],
            existingBlocks: {}
        }
    },
    computed: {
        ...mapState({
            projects: state => state.projects.projects,
            projectBlocks: state => state.projects.projectBlocks
        }),
        projectNames: function() {
            let names = [];
            for (const project of this.projects) {
                names.push(project.name);
            }
            return names;
        },
        title: function() {
            return this.selected.name;
        },
        description: function() {
            return this.selected.description;
        }
    },
    created: function() {
        this.loadProjects();
    },
    methods: {
        ...mapActions({
            loadProjects: 'projects/loadProjects',
            updateProject: 'projects/updateProject',
            loadSurvey: 'surveys/loadSurvey',
            saveProjectBlocks: 'projects/saveProjectBlocks'
        }),
        ...mapMutations({
            setSelectedId: 'projects/setSelectedProjectId'
        }),
        selectProject: function() {
            this.projectPicked = !this.projectPicked; 
            this.seen = !this.seen;
            this.loadSurvey(this.selected.surveyId);
            this.saveProjectBlocks(this.selected.blocks);

            this.existingBlocks = this.selected.blocks;
            for (const block in this.selected.blocks) {
                for (const graph of this.selected.blocks[block]) {
                    this.visualizations.push(block + " - " + graph[0]);
                }
            }
            this.setSelectedId(this.selected.projectId);
        },
        createProject: function() {
            const payload = {
                name: this.title,
                description: this.description,
                surveyId: this.selected.surveyId,
                projectId: this.title + "+" + this.selected.surveyId,
                blocks: this.projectBlocks,
                hooked: false
            };
            this.updateProject(payload);
        }
    }
}
</script>
