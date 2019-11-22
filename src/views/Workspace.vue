<template>
  <div>
    <Header/>
    <div class="container" style="padding:10px 10px;">
      <div class="well" style="padding-top: 136px;">
          <button v-on:click="postSurvey('API Test Survey')">POST dummy survey</button>
          <p>{{ postText }}</p>
          <button v-on:click="getSpecificSurvey('SV_b78ghjEDgpEZU3j', ...arguments)">Log survey SV_b78ghjEDgpEZU3j</button>
          <p>{{ getText }}</p>
          <div style="width: 50%; margin: 0 auto;">
            <p v-for="survey in formattedSurveyName" :key="survey">{{ survey }}</p>
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
      surveyList: [],
      postText: "",
      getText: ""
    }
  },
  computed: {
    formattedSurveyName: function() {
      var formattedList = [];
      this.surveyList.forEach(function(survey, index) {
        formattedList.push("Survey " + (index + 1) + " - " + survey.name);
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
    postSurvey: function(name) {
      var duplicate = false;
      this.surveyList.forEach(survey => {
        if (survey.name === name) {
          this.postText = "Error: A survey with the name \"" + name + "\" already exists.";
          duplicate = true;
        }
      });
      if (duplicate) return;
      this.postText = "Creating survey...";
      var options = {
          method: 'POST',
          url: window.location.origin + '/api/surveys',
          json: {"SurveyName": name, "Language": "EN", "ProjectCategory": "CORE"},
          headers: {
              'x-api-token': process.env.VUE_APP_Q_API_TOKEN,
              'content-type': 'application/json',
              'Accept': 'application/json'
          },
      };
      request(options, function(error, response, body) {
          if (error) throw new Error(error);
          console.log(body);
          this.postText = "...survey created!";
          this.getSurveys();
      }.bind(this));
    },
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
          var survey = JSON.parse(body);
          console.log(survey);
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
          this.surveyList = res.result.elements;
      }.bind(this));
    }
  }
}

</script>