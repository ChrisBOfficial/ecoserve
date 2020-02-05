<template>
  <div>
    <Header/>
    <div>
        <b-tabs content-class="mt-2">
        <b-tab title="Bar Graphs" active><p>I'm the first tab</p></b-tab>
        <b-tab title="Circular Charts"><p>I'm the second tab</p></b-tab>
  </b-tabs>
</div>
    <Footer/>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { mapState } from 'vuex'

export default {
  name: 'about',
  components: {
    Header,
    Footer
  },
  computed: {
    ...mapState({
      selectedId: state => state.projects.selectedProjectId
    })
  },
  created: function() {
    console.log(this.selectedId);
  }
}
</script>
