<template>
  <div class="home">
    <Scene></Scene>
    <BigScreen></BigScreen>
  </div>
</template>

<script setup>
// @ is an alias to /src
import Scene from "@/components/Scene.vue";
import BigScreen from "@/components/BigScreen.vue";
import { onMounted, reactive, ref } from "vue";
import gsap from "gsap";

</script>
<style lang="less"></style>