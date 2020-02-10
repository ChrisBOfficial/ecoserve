<template>
  <div>
    <Header/>
    <div>
        <b-tabs content-class="mt-2">
          <b-tab title="Bar Graphs" active><p>I'm the check 1 tab</p></b-tab>
          <b-tab title="Circular Charts" class="body">
            <grid
              :draggable="true"
              :sortable="true"
              :items="items"
              :height="100"
              :width="100">
              <template slot="cell" scope="props">
              <div>{{circles}}</div>
              </template>
              </grid>
          </b-tab>
        </b-tabs>
    </div>
    <Footer/>
  </div>
</template>

<script src="https://d3js.org/d3.v5.min.js"></script>


<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { mapState } from 'vuex'
import * as d3 from 'd3'


export default {
  name: 'dashboard',
  components: {
    Header,
    Footer
  },
  data () {
    return {
      items: [
        'a',
        'b',
        'c'
      ]
    }
  },
  computed: {
    ...mapState({
      selectedId: state => state.projects.selectedProjectId
    })
  },
  created: function() {
    console.log(this.$route.query.id);
    this.createGraph(this.jsonCircles);
  },
  
  methods: {
    createGraph: function(graphData){
      svgContainer = d3.select("body").append("svg")
                                      .attr("width", 200)
                                      .attr("height", 200);
      circles = svgContainer.selectAll("circle")
                            .data(graphData)
                            .enter()
                            .append("circle");
      circleAttributes = circles 
                        .attr("cx", function (d) { return d.x_axis; })
                        .attr("cy", function (d) { return d.y_axis; })
                        .attr("r", function(d) { return d.radius; })
                        .style("fill", function(d) { return d.color; });
    }
  }
}
</script>
