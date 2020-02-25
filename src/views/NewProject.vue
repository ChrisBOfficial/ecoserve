<template>
    <div class="new-project-container" style="padding: 15vh 0vh 0vh 0vh;">
        <Header />
        <b-container>
            <b-row class="h-100">
                <h1>{{ title }}</h1>
            </b-row>
            <b-row>
                <b-form-input v-model="title" placeholder="Enter Project Title"></b-form-input>
                <b-form-input v-model="description" placeholder="Enter Project Description"></b-form-input>
            </b-row>
            <b-row>
                <h4>Create New Survey</h4>
            </b-row>
            <b-row class="align-items-center">
                <b-button href="https://login.qualtrics.com/login" target="_blank">Link to Qualtrics</b-button>
            </b-row>
            <b-row>
                <survey-blocks />
            </b-row>
            <b-row>
                <h2>Visualization Dashboard</h2>
                <visualization-dashboard />
            </b-row>

            <b-row align-h="center">
                <b-col class="col-4">
                    <b-button style="background-color:DarkSeaGreen;" v-b-modal.modal-center>CREATE PROJECT</b-button>
                    <b-modal
                        id="modal-center"
                        @show="validateForm"
                        @hide="createProject"
                        centered
                        :hide-header="true"
                        size="sm"
                        :no-close-on-backdrop="true"
                        :no-close-on-esc="true"
                        :ok-only="true"
                    >
                        <p style="text-align: center;">Project created!</p>
                    </b-modal>
                </b-col>
            </b-row>
        </b-container>
        <p style="text-align: center; color: red;" v-for="error in validateErrors" :key="error">{{ error }}</p>
        <Footer />
    </div>
</template>

<script>
import VisualizationDashboard from "@/components/VisualizationDashboard.vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import surveyBlocks from "@/components/surveyBlocks.vue";
import { mapActions, mapState, mapMutations } from "vuex";

export default {
    components: {
        Header,
        Footer,
        VisualizationDashboard,
        surveyBlocks
    },
    data() {
        return {
            title: "",
            description: "",
            validateErrors: []
        };
    },
    computed: {
        ...mapState({
            survey: state => state.surveys.survey,
            projectBlocks: state => state.projects.projectBlocks
        })
    },
    created() {
        window.scrollTo(0, 0);
        this.setSurvey({});
        this.setProjectBlocks([]);
    },
    methods: {
        ...mapActions({
            loadSurveys: "surveys/loadSurveys",
            loadSurvey: "surveys/loadSurvey",
            saveProject: "projects/saveProject"
        }),
        ...mapMutations({
            setSurvey: "surveys/setSurvey",
            setProjectBlocks: "projects/setProjectBlocks"
        }),
        validateForm(bvModalEvt) {
            let invalid = false;
            this.validateErrors = [];
            let blocks = JSON.parse(JSON.stringify(this.projectBlocks));

            if (this.title === "") {
                this.validateErrors.push("Please provide a title");
                invalid = true;
            }
            if (this.description === "") {
                this.validateErrors.push("Please provide a description");
                invalid = true;
            }
            if (this.survey.id === undefined) {
                this.validateErrors.push("Project requires a survey");
                invalid = true;
            }
            if (blocks.length === 0) {
                this.validateErrors.push("Project requires at least one visualization");
                invalid = true;
            }
            if (invalid) {
                if (bvModalEvt) bvModalEvt.preventDefault();
                return false;
            } else {
                this.$bvModal.show("modal-center");
                return true;
            }
        },
        createProject() {
            const payload = {
                name: this.title,
                description: this.description,
                surveyId: this.survey.id,
                projectId: this.title + "+" + this.survey.id,
                blocks: this.projectBlocks,
                hooked: false
            };
            this.saveProject(payload);
            this.$router.push("projects");
        }
    }
};
</script>

<style scoped>
@import "../assets/grayscale.css";
</style>
