<template>
  <div>
    <Header/>
    <div>
        <b-tabs content-class="mt-2">
        <b-tab title="Bar Graphs" active>
            <p>I'm the first tab</p>
            <BarChart title="Bar Chart" xKey="name" yKey="amount" conf="confidence" :data="barChartData"/>
        </b-tab>
        <b-tab title="Circular Charts"><p>I'm the second tab</p></b-tab>
  </b-tabs>
</div>
    <Footer/>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import BarChart from '@/components/Barchart.vue'

export default {
  name: 'dashboard',
  components: {
    Header,
    Footer,
    BarChart
  },
    data: () => ({
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
        ]
    }),
  created: function() {
    console.log(this.$route.query.id);
  }
}
</script>
