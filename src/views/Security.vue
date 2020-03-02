<template>
    <div>
        <Header />
        <section style="min-height:100vh;"></section>
        <Footer />
    </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
    name: "security",
    components: {
        Header,
        Footer
    },
    created() {
        window.scrollTo(0, 0);
    }
};
</script>
