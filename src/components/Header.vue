<template>
    <div id="nav">
        <nav class="navbar navbar-expand-lg navbar-light fixed-top navbar-shrink" id="mainNav">
            <div class="container">
                <router-link class="navbar-brand" to="/"
                    ><img src="../assets/ecoserve-lower.png" height="100" width="100" style="margin:-28px 0px"
                /></router-link>
                <div class="collapse navbar-collapse" id="navbarResponsive">
                    <ul class="navbar-nav ml-auto">
                        <li class="nav-item">
                            <router-link class="nav-link" to="/about">ABOUT</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/projects">PROJECTS</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/contact">CONTACT</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/">LOGIN</router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </div>
</template>

<script>
export default {
    name: "Header"
};
</script>
