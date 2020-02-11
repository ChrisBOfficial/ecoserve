<template>
  <div>
    <Header/>
    <div>
        <b-tabs content-class="mt-2">
        <b-tab title="Bar Graphs" active>
            <p>I'm the first tab</p>
            <b-tabs vertical>
                <b-tab v-for="species in barChartData" :title="species.name">
                    <p>{{species.name}}</p>
                    <BarChart title="Bar Chart" xKey="name" yKey="amount" conf="confidence" :data="barChartData"/>
                </b-tab>
            </b-tabs>

        </b-tab>
        <b-tab title="Circular Charts">
            <p>I'm the second tab</p>
            <CirclularChart title="Circle Chart" xKey="service" yKey="mean" :data="CircleChartData"/>
        </b-tab>
  </b-tabs>
</div>
    <Footer/>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import BarChart from '@/components/Barchart.vue'
import CirclularChart from "../components/CirclularChart";

export default {
  name: 'dashboard',
  components: {
      CirclularChart,
    Header,
    Footer,
    BarChart
  },
    data: () => ({
        speciesList: ["Roses", "Tulips", "Daisies", "Narcissuses", "Wallaby"],
        barChartData: [
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
        CircleChartData: [
            {
                service: "Wild Food",
                mean: -2.5526315789473686
            },
            {
                service: "Forest Production",
                mean:2.8461538461538462},
            {service:"Pollination", mean:-2.717948717948718},
            {service:"Ecological Integrity",mean:-1.4594594594594596},
            {service:"Biodiversity",mean:-2},
            {service:"Forage",mean:1.6315789473684212},
            {service:"Livestock",mean:-1.5135135135135131},
            {service:"Water",mean:1.4594594594594596}
        ]
    }),
  created: function() {
    console.log(this.$route.query.id);
  }
}
</script>
