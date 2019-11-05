<template>
  <div id="app">
    <div id="nav">
      <nav class="navbar navbar-expand-lg navbar-light bg-light shadow fixed-top" style="background-color:darkslategray;">
        <div class="container">
          <router-link class="navbar-brand" to="/">EnviConser</router-link>
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
                  <button onclick="document.getElementById('id01').style.display='block'" style="width:auto;">LOGIN</button>
                </li>
              </ul>
            </div>
        </div>
      </nav>
    </div>

    <!-- Dynamically loaded views -->
    <router-view/>

     <!-- Footer -->
    <footer class="page-footer font-small blue pt-4" style="background-color: darkslategray;">

      <!-- Footer Links -->
      <div class="container-fluid text-center text-md-left">
        <!-- Grid row -->
        <div class="row">
            <!-- Grid column -->
            <div class="col-md-6 mt-md-0 mt-3">
              <!-- Content -->
              <h5 class="text-uppercase">Footer Content</h5>
              <p>Here you can use rows and columns to organize your footer content.</p>
            </div>
            <!-- Grid column -->
            <hr class="clearfix w-100 d-md-none pb-3">
            <!-- Grid column -->
            <div class="col-md-3 mb-md-0 mb-3">
              <!-- Links -->
              <h5 class="text-uppercase">Links</h5>
              <ul class="list-unstyled">
                <li>
                  <a href="#!">Link 1</a>
                </li>
                <li>
                  <a href="#!">Link 2</a>
                </li>
                <li>
                  <a href="#!">Link 3</a>
                </li>
                <li>
                  <a href="#!">Link 4</a>
                </li>
              </ul>
            </div>

            <!-- Grid column -->
            <div class="col-md-3 mb-md-0 mb-3">
              <!-- Links -->
              <h5 class="text-uppercase">Links</h5>
              <ul class="list-unstyled">
                <li>
                  <a href="#!">Link 1</a>
                </li>
                <li>
                  <a href="#!">Link 2</a>
                </li>
                <li>
                  <a href="#!">Link 3</a>
                </li>
                <li>
                  <a href="#!">Link 4</a>
                </li>
              </ul>
            </div>
        </div>
      </div>
      <!-- Footer Links -->
    </footer>
  </div>
</template>

<!--CSS Styling-->
<style>
@import "https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css";
@import "./assets/style.css";
</style>
