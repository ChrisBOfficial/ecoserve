<template>
    <body class="lParent">
        <div class="loadingio-spinner-pulse">
            <div class="ldio-container">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    </body>
</template>

<script>
export default {
    name: "Loading"
};
</script>

<style scoped>
@keyframes ldio-container-1 {
    0% {
        top: 36px;
        height: 128px;
    }
    50% {
        top: 60px;
        height: 80px;
    }
    100% {
        top: 60px;
        height: 80px;
    }
}
@keyframes ldio-container-2 {
    0% {
        top: 42px;
        height: 116px;
    }
    50% {
        top: 60px;
        height: 80px;
    }
    100% {
        top: 60px;
        height: 80px;
    }
}
@keyframes ldio-container-3 {
    0% {
        top: 48px;
        height: 104px;
    }
    50% {
        top: 60px;
        height: 80px;
    }
    100% {
        top: 60px;
        height: 80px;
    }
}
.ldio-container div {
    position: absolute;
    width: 30px;
}
.ldio-container div:nth-child(1) {
    left: 35px;
    background: darkseagreen;
    animation: ldio-container-1 1s cubic-bezier(0, 0.5, 0.5, 1) infinite;
    animation-delay: -0.2s;
}
.ldio-container div:nth-child(2) {
    left: 85px;
    background: #5f9f5f;
    animation: ldio-container-2 1s cubic-bezier(0, 0.5, 0.5, 1) infinite;
    animation-delay: -0.1s;
}
.ldio-container div:nth-child(3) {
    left: 135px;
    background: #2f4f2f;
    animation: ldio-container-3 1s cubic-bezier(0, 0.5, 0.5, 1) infinite;
    animation-delay: undefineds;
}

#lParent {
    position: relative;
}
.loadingio-spinner-pulse {
    width: 200px;
    height: 200px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -100px 0 0 -100px;
    overflow: hidden;
}
.ldio-container {
    width: 100%;
    height: 100%;
    position: relative;
    transform: translateZ(0) scale(1);
    backface-visibility: hidden;
    transform-origin: 0 0; /* see note above */
}
.ldio-container div {
    box-sizing: content-box;
}
</style>
