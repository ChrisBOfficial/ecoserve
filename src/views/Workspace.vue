<template>
  <div>
    <Header/>
    <section class="masthead-2">
        <div class="container h-100">
            <div class="row h-100 align-items-center">
                <div class="col-6 text-center align-items-center">
                  <button v-on:click="postSurvey">POST dummy survey</button>
                  <button v-on:click="getSpecificSurvey('SV_b78ghjEDgpEZU3j', ...arguments)">Log survey SV_b78ghjEDgpEZU3j</button>
                </div>
            </div>
        </div>
    </section>
    <Footer/>
  </div>
</template>


<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
var request = require('request');

export default {
  name: 'workspace',
  components: {
    Header,
    Footer
  },
  mounted: function() {
    this.getSurveys();
  },
  methods: {
    postSurvey: function() {
      var options = {
          method: 'POST',
          url: window.location.origin + '/api/surveys',
          json: {"SurveyName": "API Test Survey", "Language": "EN", "ProjectCategory": "CORE"},
          headers: {
              'x-api-token': process.env.VUE_APP_Q_API_TOKEN,
              'content-type': 'application/json',
              'Accept': 'application/json'
          },
      };
      request(options, function(error, response, body) {
          if (error) throw new Error(error);
          console.log(body);
      });
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
          var surveys = JSON.parse(body);
          console.log(surveys);
      });
    },
    getSpecificSurvey: function(surveyId) {
      var options = {
          method: 'GET',
          url: window.location.origin + '/api/surveys?surveyId=' + surveyId,
          headers: {
              'x-api-token': process.env.VUE_APP_Q_API_TOKEN
          }
      };
      request(options, function(error, response, body) {
          if (error) throw new Error(error);
          var surveys = JSON.parse(body);
          console.log(surveys);
      });
    }
  }
}

</script>