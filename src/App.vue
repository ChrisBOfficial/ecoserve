<template>
    <div id="app">
        <!-- Dynamically loaded views -->
        <router-view />
    </div>
</template>

<script>
import store from "./store";

export default {
    store
};
</script>

<!--CSS Styling-->
<style scoped>
@import "./assets/style.css";
@import "https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css";
@import "https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i";
@import "https://fonts.googleapis.com/css?family=Varela+Round";
</style>
