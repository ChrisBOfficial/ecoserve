<template>
    <div>
        <Header/>
        <section class="masthead-2">
            <div class="container h-100">
                <div class="row h-100 align-items-center">
                    <div class="col-6 text-center align-items-center">
                        <ul>
                            <li class="project-list">
                                <a href ="#" style="color:seagreen;">Project 1</a>
                                <p>Brief description of project</p>
                            </li>
                            <li class="project-list">
                                <a href ="#" style="color:seagreen;">Project 2</a>
                                <p>Brief description of project</p>
                            </li>
                            <li class="project-list">
                                <a href ="#" style="color:seagreen;">Project 3</a>
                                <p>Brief description of project</p>
                            </li>
                            <li class="project-list">
                                <a href ="#" style="color:seagreen;">Project 4</a>
                                <p>Brief description of project</p>
                            </li>
                        </ul>
                    </div>
                    <div class="col-6 text-center align-items-center">
                        <img src="@/assets/jon.jpg" alt="Project image" class="thumb">
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

export default {
    created: function () {
        console.log("PROJECT IS LOADED")
    },
    components: {
        Header,
        Footer
    }
}
</script>
