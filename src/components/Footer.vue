<template>
    <footer class="page-footer font-small blue pt-4 sticky-bottom" style="background-color: DarkSeaGreen; ">
        <div class="container-fluid text-center text-md-left">
            <div class="row" style="color: white;">
                <div id="footerCopy" class="col-md-4 mt-md-0 mt-3">
                    <h5>A tool for visualizing survey responses</h5>
                    <router-link to="/contact" style="color: white;">Contact us</router-link>
                </div>
                <div class="col-md-4 mt-md-0 mt-3" />
                <div class="col-md-2 mt-md-0 mt-3" />
                <div class="col-md-2 mt-md-0 mt-3 text-md-right" style="padding-bottom: 24px;">
                    <p id="footerLink" @click="footerRoute('guidelines')">Survey guidelines</p>
                    <p id="footerLink" @click="footerRoute('security')">Security</p>
                    <a id="footerLink" href="./etc/privacyPolicy.pdf" target="_blank">Privacy policy</a>
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
export default {
    name: "Footer",
    methods: {
        footerRoute(text) {
            this.$router.push("/" + text);
        }
    }
};
</script>
