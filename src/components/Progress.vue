<template>
    <div class="progress-circle-container">
        <div class="progress-img-outer">
            <div class="progress-img-inner"></div>

        </div>
        <span class="progress-loading">0%</span>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="less">
.progress-circle-container {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.progress-img-outer {
    margin: 0px auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 398px;
    height: 396px;
    background-image: url(@/assets/processOuter.png);
    animation: 5s linear 0s infinite normal none running outer;
}

.progress-img-inner {
    width: 347px;
    height: 353px;
    background-image: url(@/assets/processInner.png);
    animation: 5s linear 0s infinite normal none running inner;
}

.progress-loading {
    color: rgb(255, 255, 255);
    font-size: 45px;
    font-style: italic;
    position: absolute;
}

@keyframes outer {
    0% {
        transform: rotate(0deg);
        transform-origin: center center;
    }

    100% {
        transform: rotate(1turn);
        transform-origin: center center;
    }
}

@keyframes inner {
    0% {
        transform: rotate(1turn);
        transform-origin: center center;
    }

    100% {
        transform: rotate(-1turn);
        transform-origin: center center;
    }
}
</style>