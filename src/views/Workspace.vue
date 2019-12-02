<template>
  <div>
    <Header/>
    <div class="container" style="padding:10px 10px;">
      <div class="well" style="padding-top: 136px;">
          <button v-on:click="getSpecificSurvey('SV_b78ghjEDgpEZU3j', ...arguments)">Log survey SV_b78ghjEDgpEZU3j</button>
          <p>{{ getText }}</p>
          <div style="width: 50%; margin: 0 auto;">
            <button v-for="survey in formattedSurveyName" :key="survey.name" v-on:click="saveSurvey(survey.name, survey.id)">{{ survey.name }}</button>
          </div>
          <button v-on:click="getSurveys">Refresh surveys</button>
      </div>
    </div>
    <Footer/>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
var request = require('request');

export default {
  name: 'workspace',
  data() {
    return {
      getText: ""
    }
  },
  computed: {
    formattedSurveyName: function() {
      var formattedList = [];
      this.$store.state.surveys.forEach(function(survey, index) {
        var surveyName = "Survey " + (index + 1) + " - " + survey.name;
        formattedList.push({ name: surveyName, id: survey.id });
      });
      return formattedList
    }
  },
  components: {
    Header,
    Footer
  },
  created: function() {
    this.getSurveys();
  },
  methods: {
    getSpecificSurvey: function(surveyId) {
      this.getText = "Pulling survey...";
      var options = {
          method: 'GET',
          url: window.location.origin + '/api/surveys?surveyId=' + surveyId,
          headers: {
              'x-api-token': process.env.VUE_APP_Q_API_TOKEN
          }
      };
      request(options, function(error, response, body) {
          if (error) throw new Error(error);
          var survey = JSON.parse(body).result;
          this.getText = "...survey pulled and logged!";
      }.bind(this));
    },
    getSurveys: function() {
      var options = {
          method: 'GET',
          url: window.location.origin + '/api/surveys',
          headers: {
              'x-api-token': process.env.VUE_APP_Q_API_TOKEN
          }
      };
      request(options, function(error, response, body) {
          if (error) throw new Error(error);
          var res = JSON.parse(body);
          this.$store.state.surveys = res.result.elements;
      }.bind(this));
    },
    saveSurvey: function(surveyName, selectedID) {
      var options = {
        method: 'POST',
        url: window.location.origin + '/api/projects',
        json: {name: surveyName, 
               data: {description: "A new project", 
                      surveyID: selectedID, 
                      blocks: { block1: ["barChart", "sorted"] }}},
        headers: {
          'content-type': 'application/json',
          'accept': 'application/json'
        }
      };
      request(options, function(error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
      }.bind(this));
    }
  }
}

</script>