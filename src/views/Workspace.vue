<template>
  <div>
    <Header/>
    <div class="container" style="padding:10px 10px;">
      <div class="well" style="padding-top: 136px;">
          <button v-on:click="getSpecificSurvey('SV_b78ghjEDgpEZU3j', ...arguments)">Log survey SV_b78ghjEDgpEZU3j</button>
          <p>{{ getText }}</p>
          <div style="width: 50%; margin: 0 auto;">
            <button v-for="survey in formattedSurveys" :key="survey.name">{{ survey.name }}</button>
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
    this.getResponses('SV_b78ghjEDgpEZU3j');
  },
  methods: {
    ...mapActions({
      loadSurveys: 'surveys/loadSurveys',
      loadSurvey: 'surveys/loadSurvey',
      getResponses: 'responses/loadResponses'
    }),
    getSpecificSurvey: function(surveyId) {
      this.loadSurvey(surveyId);
    }
  }
}

</script>