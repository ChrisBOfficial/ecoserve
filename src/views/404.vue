<template>
    <body>
        <a href="/">
            <svg height="0.8em" width="0.8em" viewBox="0 0 2 1" preserveAspectRatio="none">
                <polyline fill="none" stroke="#777777" stroke-width="0.1" points="0.9,0.1 0.1,0.5 0.9,0.9" />
            </svg>
            Go back
        </a>
        <div class="background-wrapper">
            <h1>404</h1>
        </div>
        <p>The page you’re looking for does not exist.</p>
    </body>
</template>

<script>
export default {
    name: "notFound"
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Eczar:800&display=swap");
body {
    height: 100vh;
    background: #121212;
    padding: 1em;
    overflow: hidden;
}
.background-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    user-select: none;
}
.background-wrapper h1 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -45%) rotate(-20deg);
    font-family: "Eczar";
    font-size: 60vmax;
    color: #282828;
    letter-spacing: 0.025em;
    margin: 0;
    transition: 750ms ease-in-out;
}
a {
    border: 2px solid #555;
    padding: 0.5em 0.8em;
    position: fixed;
    z-index: 1;
    color: #555;
    text-decoration: none;
    display: flex;
    align-items: center;
    transition: 150ms;
}
a svg > polyline {
    transition: 150ms;
}
a:hover {
    color: #333;
    background: #dadada;
    border-color: transparent;
}
a:hover svg > polyline {
    stroke: #000;
}
a:hover + .background-wrapper > h1 {
    color: #dadada;
}
p {
    color: #dadada;
    font-size: calc(1em + 3vmin);
    position: fixed;
    bottom: 1rem;
    right: 1.5rem;
    margin: 0;
    text-align: right;
    text-shadow: -1px -1px 0 #121212, 1px 1px 0 #121212, -1px 1px 0 #121212, 1px -1px 0 #121212;
}
@media screen and (min-width: 340px) {
    p {
        width: 75%;
    }
}
@media screen and (min-width: 560px) {
    p {
        width: 55%;
    }
}
@media screen and (min-width: 940px) {
    p {
        width: 35%;
    }
}
@media screen and (min-width: 1300px) {
    p {
        width: 30%;
    }
}
</style>
