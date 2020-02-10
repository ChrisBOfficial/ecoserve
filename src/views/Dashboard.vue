<template>
  <div>
    <Header/>
    <div>
        <b-tabs content-class="mt-2">
          <b-tab title="Bar Graphs" active><p>I'm the check 1 tab</p></b-tab>
          <b-tab title="Circular Charts" class="circularGraph">
            <grid
              :draggable="true"
              :sortable="true"
              :items="items"
              :height="100"
              :width="100">
                <template slot="cell" scope="props">
                  <div>{{props.item}}</div>
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
      ],
      tempData: [
        { "x_axis": 30, "y_axis": 30, "radius": 20, "color" : "green" },
        { "x_axis": 70, "y_axis": 70, "radius": 20, "color" : "purple"},
        { "x_axis": 110, "y_axis": 100, "radius": 20, "color" : "red"}
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
    
  },
  mounted() {
    this.createGraph();
  },

  methods: {
    createGraph: function(){
      var svgContainer = d3.select(".circularGraph").append().append("svg")
                                      .attr("width", 200)
                                      .attr("height", 200);
      var circles = svgContainer.selectAll("circle")
                            .data(this.tempData)
                            .enter()
                            .append("circle");
      var circleAttributes = circles 
                        .attr("cx", function (d) { return d.x_axis; })
                        .attr("cy", function (d) { return d.y_axis; })
                        .attr("r", function(d) { return d.radius; })
                        .style("fill", function(d) { return d.color; });
    }
  }
}
</script>
