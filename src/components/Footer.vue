<template>
    <footer class="page-footer font-small blue pt-4 sticky-bottom" style="background-color: DarkSeaGreen; ">
        <div class="container-fluid text-center text-md-left">
            <div class="row" style="color: white;">
                <div id="footerCopy" class="col-md-6 mt-md-0 mt-3">
                    <h5>A tool for visualizing survey responses</h5>
                    <p>ecoserve</p>
                </div>
                <div class="col-md-6 mt-md-0 mt-3 text-md-right">
                    <p id="footerLink" @click="footerRoute('guidelines')">Survey guidelines</p>
                    <p id="footerLink" @click="footerRoute('security')">Security</p>
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
