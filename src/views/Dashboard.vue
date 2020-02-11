<template>
  <div>
    <Header/>
    <div>
        <b-tabs content-class="mt-2">
          <b-tab id="barChartTab" title="Bar Graphs" active>
            <p>I'm the check 3 tab</p>
            <b-container class="bv-example-row">
              <b-row>
                <b-col v-for="(item , index) in barChartDatas" :key="index">
                  <BarChart title="Bar Chart" xKey="name" yKey="amount" conf="confidence" :ind="index" :data="item"/> 
                </b-col>
              </b-row>
            </b-container>
          </b-tab>
          <b-tab title="Circular Charts" class="circularGraph">
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
import BarChart from '@/components/BarChart.vue'
import { Dashboard, Layout, DashItem } from "vue-responsive-dash";


import { mapState } from 'vuex'
import * as d3 from 'd3'


export default {
  name: 'dashboard',
  components: {
    Header,
    Footer,
    BarChart,
    Dashboard,
    Layout,
    DashItem
  },
  data () {
    return {
      index: 0,
      items: [
        'a',
        'b',
        'c'
      ],
      tempData: [
        { "x_axis": 30, "y_axis": 30, "radius": 20, "color" : "green" },
        { "x_axis": 70, "y_axis": 70, "radius": 20, "color" : "purple"},
        { "x_axis": 110, "y_axis": 100, "radius": 20, "color" : "red"}
      ],
      barChartDatas:[
        [
          {
            name: "Roses",
            amount: 25,
            confidence: "low"
          },
          {
            name: "Tulips",
            amount: 40,
            confidence: "none"
          },
          {
            name: "Daisies",
            amount: 15,
            confidence: "moderate"
          },
          {
            name: "Narcissuses",
            amount: 9,
            confidence: "extreme"
          },
          {
            name: "Wallaby",
            amount: 32,
            confidence: "high"
          }
        ],
        [
          {
            name: "Roses",
            amount: 45,
            confidence: "low"
          },
          {
            name: "Tlips",
            amount: 5,
            confidence: "none"
          },
          {
            name: "Daisies",
            amount: 15,
            confidence: "moderate"
          },
          {
            name: "Narcissuses",
            amount: 9,
            confidence: "extreme"
          },
          {
            name: "Wallaby",
            amount: 32,
            confidence: "high"
          }
        ]
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
    //this.createBarGraph();
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
    },
    createBarGraph: function(){
      //<BarChart title="Bar Chart" xKey="name" yKey="amount" conf="confidence" :data="barChartData"/>
      var i = 0;
      for (i = 0; i < this.barChartDatas.length; i++){
        const div = document.createElement('div');
        //console.log(this.barChartDatas[i]);
        div.innerHTML = '<p> A new chart!</p> <BarChart title="Bar Chart" xKey="name" yKey="amount" conf="confidence" :data="' + this.barChartDatas[i] + '"/>';
        document.getElementById('barChartTab').appendChild(div);
      }
    }
  }
}
</script>
