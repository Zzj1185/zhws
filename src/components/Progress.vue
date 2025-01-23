<template>
    <a-progress :stroke-color="{
        from: '#00F5FF',
        to: '#4169E1',
    }" :percent="0" trailColor="#E8E8E8" status="active" class="progress" />
</template>

<script>
export default {

}
</script>

<style lang="less">
.progress {
    position: absolute;
    top: calc(100vh / 2 - 15px);
    left: 27.5vw;
    width: 45vw;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    z-index: 999;

    .ant-progress-bg,
    .ant-progress-inner,
    .ant-progress-outer {
        height: 5vh !important;

    }

    .ant-progress-inner {
        box-shadow: 0 0 0.1vw 0.3vh #1890ff;
    }

    .ant-progress-text {
        font-family: "Times New Roman", Times, serif;
        font-weight: 600;
        letter-spacing: 0.3vw !important;
        font-size: 1.2vw !important;
    }
}

.ant-progress-text {
    width: 100% !important;
    display: flex !important;
    align-items: center;
    justify-content: center;
    position: absolute !important;
    z-index: 99 !important;
    color: #363636 !important;
}
</style>