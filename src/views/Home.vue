<template>
    <div>
        <Header />
        <section class="py-5">
            <header class="masthead">
                <b-row class="h-100 align-items-center">
                    <div class="col-12 text-center">
                        <h1 class="font-weight-light" style="color:white;">
                            INTERGRATIVE ECOSYSTEM SERVICE ANALYSIS TOOL
                        </h1>
                    </div>
                </b-row>
            </header>
        </section>
        <Footer />
    </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
    name: "home",
    components: {
        Header,
        Footer
    }
};
</script>
