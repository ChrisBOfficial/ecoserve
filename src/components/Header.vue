<template>
    <div id="nav">
      <nav class="navbar navbar-expand-lg navbar-light bg-light shadow sticky-top" style="background-color:darkslategray;">
        <div class="container">
          <router-link class="navbar-brand" to="/">IESAT</router-link>
            <div class="collapse navbar-collapse" id="navbarResponsive">
              <ul class="navbar-nav ml-auto">
                <li class="nav-item">
                  <router-link class="nav-link" to="/">ABOUT</router-link>
                </li>

                <li class="nav-item">
                  <router-link class="nav-link" to="/project">PROJECT</router-link>
                </li>

                <li class="nav-item">
                  <router-link class="nav-link" to="/contact">CONTACT</router-link>
                </li>

                <li class="nav-item">
                  <router-link class="nav-link" to="/csv">CSV</router-link>
                </li>

                <li class="nav-item">
                  <router-link class="nav-link" to="/workspace">WORKSPACE</router-link>
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
    name: 'Header'
}
</script>
