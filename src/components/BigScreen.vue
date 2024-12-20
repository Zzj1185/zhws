<template>
  <div id="bigScreen">
    <div class="header">污水处理厂智慧监管平台</div>
    <div class="main">
      <div class="left" ref="leftRef">

      </div>
      <div class="center" ref="centerRef">
        <div ref="centerBtnRef" class="centerBtn">
          <template v-if="mainModelFlag">
            <div @click="toggleTwoSides" class="changeView">{{ twoSidesFlag ? '两边打开' : '两边隐藏' }}</div>
            <div @click="changeView('inital')" class="changeView">
              初始视角
            </div>

            <div @click="changeView('lblc')" class="changeView">
              滤布滤池
            </div>
            <div @click="changeView('panorama')" class="changeView">
              全景漫游
            </div>
            <div @click="togglePanel" class="changeView">{{ tagFlag ? '隐藏数据' : '显示数据' }}</div>
            <!-- <div @click="inspection" class="changeView">人物巡检</div> -->
          </template>
          <template v-else>
            <div class="changeView" @click="backToMainModel()">
              返回
            </div>
          </template>
        </div>





      </div>
      <div class="right" ref="rightRef">

      </div>
    </div>
  </div>
</template>

<script setup>
import eventHub from "@/utils/eventHub";
import { ref } from "vue";


let mainModelFlag = ref(true)
const backToMainModel = () => {
  mainModelFlag.value = true
  eventHub.emit('dblClickModel', { msg: 'tomain' })

}



eventHub.on('dblClickModel', (msg) => {
  if (!msg) {
    mainModelFlag.value = false

  } else {
    mainModelFlag.value = true


  }
})

// 改变视角
const changeView = (e) => {
  eventHub.emit('changeView', { type: e })
}
// 改变面板显影
let tagFlag = ref(false)
const togglePanel = () => {
  eventHub.emit('togglePanel', { type: !tagFlag.value })
  tagFlag.value = !tagFlag.value
}
// 人物巡检
const inspection = () => { }

// 两边显示隐藏
let twoSidesFlag = ref(false);
let leftRef = ref(null)
let rightRef = ref(null)
let centerRef = ref(null)
let centerBtnRef = ref(null);
const toggleTwoSides = () => {
  if (twoSidesFlag.value) {
    leftRef.value.classList.add('expandLeft')
    rightRef.value.classList.add('expandRight')

    rightRef.value.classList.contains('shrinkRight') && rightRef.value.classList.remove('shrinkRight')
    leftRef.value.classList.contains('shrinkLeft') && leftRef.value.classList.remove('shrinkLeft')

    centerBtnRef.value.classList.add('centerBtnRefExpand')
    centerBtnRef.value.classList.remove('centerBtnRefShrink')


  } else {
    leftRef.value.classList.add('shrinkLeft')
    rightRef.value.classList.add('shrinkRight')

    rightRef.value.classList.contains('expandRight') && rightRef.value.classList.remove('expandRight')
    leftRef.value.classList.contains('expandLeft') && leftRef.value.classList.remove('expandLeft')

    centerBtnRef.value.classList.add('centerBtnRefShrink')
    centerBtnRef.value.classList.remove('centerBtnRefExpand')


  }
  twoSidesFlag.value = !twoSidesFlag.value

}




</script>

<style scoped>
.shrinkLeft {
  transform: translateX(-100%);
  transition: transform 2s ease;
  transform-origin: center left;
}

.expandLeft {
  transform: translateX(0%);
  transition: transform 2s ease;
  transform-origin: center right;
}

.shrinkRight {
  transform: translateX(100%);
  transition: transform 2s ease;
  transform-origin: center right;
}

.expandRight {
  transform: translateX(0%);
  transition: transform 2s ease;
  transform-origin: center left;
}

.centerBtnRefExpand {
  transform: translateX(0px);
  transition: transform 2s ease;
  transform-origin: center center;
}

.centerBtnRefShrink {
  transform: translateX(400px);
  transition: transform 2s ease;
  transform-origin: center center;
}

#bigScreen {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 100;

  left: 0;
  top: 0;
  pointer-events: none;
  display: flex;
  flex-direction: column;
}

.header {


  width: 19.2rem;
  height: 1rem;
  /* line-height: 100%; */
  background-image: url(@/assets/titBg.png);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  text-align: center;
  color: rgb(226, 226, 255);
  font-size: 0.4rem;
}

.main {
  flex: 1;
  width: 19.2rem;
  display: flex;
  justify-content: space-between;
}

.left {


  /* width: 20%; */
  width: 400px;
  height: 100%;
  background: rgba(110, 204, 255, 0.1)
}

.center {
  flex: 1;
  font-weight: bold;
  font-size: 30px;
  position: relative;
  padding: 10px;

}

.centerBtn {
  position: absolute;
  right: 0;
  top: 0;
  pointer-events: auto;
}


.right {
  /* width: 4rem;
  background-image: url(@/assets/bg/line_img.png);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: left center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.4rem 0; */

  /* width: 20%; */
  width: 400px;
  height: 100%;
  background: rgba(110, 204, 255, 0.1)
}

.cityEvent {
  position: relative;
  width: 3.5rem;
  /* height: 3rem; */
  margin-bottom: 0.5rem;
  background-image: url(@/assets/bg/bg_img03.png);
  background-repeat: repeat;
}

.cityEvent::before {
  width: 0.4rem;
  height: 0.4rem;
  position: absolute;
  left: 0;
  top: 0;
  border-top: 4px solid rgb(34, 133, 247);
  border-left: 4px solid rgb(34, 133, 247);
  content: "";
  display: block;
}

.cityEvent::after {
  width: 0.4rem;
  height: 0.4rem;
  position: absolute;
  right: 0;
  top: 0;
  border-top: 4px solid rgb(34, 133, 247);
  border-right: 4px solid rgb(34, 133, 247);
  content: "";
  display: block;
}

.footerBorder {
  position: absolute;
  bottom: 0;
  bottom: 0;
  width: 3.5rem;
  height: 0.4rem;
}

.footerBorder::before {
  width: 0.4rem;
  height: 0.4rem;
  position: absolute;
  left: 0;
  top: 0;
  border-bottom: 4px solid rgb(34, 133, 247);
  border-left: 4px solid rgb(34, 133, 247);
  content: "";
  display: block;
}

.footerBorder::after {
  width: 0.4rem;
  height: 0.4rem;
  position: absolute;
  right: 0;
  top: 0;
  border-bottom: 4px solid rgb(34, 133, 247);
  border-right: 4px solid rgb(34, 133, 247);
  content: "";
  display: block;
}

.icon {
  width: 40px;
  height: 40px;
}

h1 {
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 0.3rem 0.3rem;
  justify-content: space-between;
  font-size: 0.3rem;
}

h3 {
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0.3rem 0.3rem;
}

h1>div {
  display: flex;
  align-items: center;
}

h1 span.time {
  font-size: 0.2rem;
  font-weight: normal;
}

.cityEvent li>p {
  color: #eee;
  padding: 0rem 0.3rem 0.3rem;
}

.list h1 {
  padding: 0.1rem 0.3rem;
}

.cityEvent.list ul {
  pointer-events: auto;
  cursor: pointer;
}

.cityEvent li.active h1 {
  color: red;
}

.cityEvent li.active p {
  color: red;
}

ul,
li {
  list-style: none;
}

.changeView {
  pointer-events: auto;
  width: 162px;
  height: 45px;
  background: url("../assets/btnBg.png");
  font-size: 18px;
  color: rgba(110, 204, 255, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  letter-spacing: 0.5em;
  margin-bottom: 10px;
}

.changeView:hover {
  color: rgb(244, 101, 17);

}
</style>
