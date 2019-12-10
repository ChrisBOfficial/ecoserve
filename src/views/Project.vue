<template>
    <div>
        <Header/>
        <section class="masthead-2">
            <b-container>
                <b-row class="h-100 align-items-center">
                    <b-col class="text-center align-items-center" id="ProjectList">
                        <h3>ALL PROJECTS</h3>
                        <ul>
                        </ul>
                    </b-col>
                    <b-col class="text-center align-items-center">
                        <img src="@/assets/jon.jpg" alt="Project image" class="thumb">
                    </b-col>
                </b-row>    
            </b-container>
        </section>
        <Footer/>
    </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import ProjectDescription from '@/components/ProjectDescription.vue'
var request = require('request');

export default {
    name: "ProjectList",
    components: {
        Header,
        Footer,
        ProjectDescription
    },
    props: ["projects"],
    data: {
        projects: [
            {
                title: "Project 1",
                description: "blah blah blah"
            },
            {
                title: "Project 2",
                description: "blah blah blah"
            },
            {
                title: "Project 3",
                description: "blah blah blah"
            }
        ]
    }

}
</script>


