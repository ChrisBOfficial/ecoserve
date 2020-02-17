<template>
    <div>
        <footer class="page-footer font-small blue pt-4 sticky-bottom" style="background-color: darkslategray;">
            <!-- Footer Links -->
            <div class="container-fluid text-center text-md-left">
                <!-- Grid row -->
                <div class="row" style="color: white;">
                    <!-- Grid column -->
                    <div class="col-md-6 mt-md-0 mt-3">
                        <!-- Content -->
                        <h5 class="text-uppercase">IESAT</h5>
                        <p>A tool for visualizing Qualtrics survey responses</p>
                    </div>
                    <!-- Grid column -->
                    <hr class="clearfix w-100 d-md-none pb-3" />
                    <!-- Grid column -->
                    <div class="col-md-3 mb-md-0 mb-3" />

                    <!-- Grid column -->
                    <div class="col-md-3 mb-md-0 mb-3">
                        <ul>
                            <li>
                                <router-link to="/about">ABOUT</router-link>
                            </li>
                            <li>
                                <router-link to="/contact">CONTACT</router-link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>

<script>
export default {
    name: "Footer"
};
</script>
