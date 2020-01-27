<template>
  <div>
    <Header/>
    <div class="container" style="padding:10px 10px;">
      <div class="well" style="padding-top: 136px;">
          <button v-on:click="getSpecificSurvey('SV_b78ghjEDgpEZU3j', ...arguments)">Log survey SV_b78ghjEDgpEZU3j</button>
          <p>{{ getText }}</p>
          <div style="width: 50%; margin: 0 auto;">
            <button v-for="survey in formattedSurveys" :key="survey.name" v-on:click="saveSurvey(survey.name, survey.id)">{{ survey.name }}</button>
          </div>
          <button v-on:click="loadSurveys">Refresh surveys</button>
      </div>
    </div>
    <Footer/>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import {mapActions, mapState} from 'vuex';
var request = require('request');

export default {
  name: 'workspace',
  data() {
    return {
      getText: ""
    }
  },
  computed: {
    ...mapState({
      surveys: state => state.surveys.surveys,
      survey: state => state.surveys.survey
    }),
    formattedSurveys: function() {
      var formattedList = [];
      this.surveys.forEach(function(survey, index) {
        var surveyName = "Survey " + (index + 1) + " - " + survey.name;
        formattedList.push({ displayName: surveyName, id: survey.id, name: survey.name });
      });
      return formattedList
    }
  },
  components: {
    Header,
    Footer
  },
  created: async function() {
    this.loadSurveys();
    // this.getResponses('SV_b78ghjEDgpEZU3j');
  },
  methods: {
    ...mapActions({
      loadSurveys: 'surveys/loadSurveys',
      loadSurvey: 'surveys/loadSurvey'
    }),
    getSpecificSurvey: function(surveyId) {
      this.loadSurvey(surveyId);
    },
    getSurveys: function() {
      var options = {
          method: 'GET',
          url: this.$store.state.apiUrl + '/api/surveys',
          headers: {
              'x-api-token': process.env.VUE_APP_Q_API_TOKEN
          }
      };
      request(options, function(error, response, body) {
          if (error) throw new Error(error);
          var res = JSON.parse(body).result;
          this.$store.state.surveys = res.elements;
      }.bind(this));
    },
    saveSurvey: function(surveyName, selectedID) {
      var options = {
        method: 'POST',
        url: window.location.origin + '/api/projects',
        json: {
          name: surveyName, 
          data: {
            description: "A new project", 
            surveyID: selectedID, 
            blocks: { 
              block1: [
                { visual: "barChart", options: ["sorted", "colorBlind"] },
                { visual: "circleChart", options: ["sorted"] }
              ]
            }
          }
        },
        headers: {
          'content-type': 'application/json',
          'accept': 'application/json'
        }
      };
      request(options, function(error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
      }.bind(this));
    },
    deleteSurvey: function(surveyName) {
      var options = {
        method: 'DELETE',
        url: window.location.origin + '/api/projects',
        json: { name: surveyName },
        url: this.$store.state.apiUrl + '/api/projects',
        json: { name: surveyName, data: { description: "A new project", 
                                          surveyID: selectedID, 
                                          blocks: { block1: ["barChart", "sorted"] } } },
        headers: {
          'content-type': 'application/json',
          'accept': 'application/json'
        }
      };
      request(options, function(error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
      }.bind(this));
    },
    getResponses: function(selectedID) {
      var options = {
        method: 'GET',
        url: this.$store.state.apiUrl + '/api/surveys/responses?surveyId=' + selectedID,
        headers: {
          'accept': 'application/json',
          'x-api-token': process.env.VUE_APP_Q_API_TOKEN
        }
      };
      request(options, function(error, response, body) {
        if (error) throw new Error(error);
      }.bind(this));
    }
  }
}

</script>