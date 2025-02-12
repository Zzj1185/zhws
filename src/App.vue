<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
  <router-view />
</template>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}

.cssrender {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  pointer-events: none;
  width: 100vw;
  height: 100vh;
}

.elementTag {
  position: relative;
  left: -3px;
  top: 2px;
}




.elementContent {
  background-color: rgb(20 143 221 / 68%);
  box-shadow: 0px 0px 12px rgb(0 128 255 / 75%);
  border: 1px solid rgb(127 177 255 / 75%);
  padding: 2px;

  color: #efefef;
}

.elementContent h1 {
  font-size: 20px;
  font-weight: bold;
  margin: 5px 0;
  color: #efefef;
}

#buildLabel {
  background: url("./assets/buildLabel.png");
  background-size: 100% 100%;
  width: 8vw;
  height: 5vh;
  position: absolute;
  top: -1vw;
  left: 3vw;
  // z-index: 0;s

  .name {
    width: 5vw;
    text-align: center;
    line-height: 4.5vh;
    margin-left: 2.5vw;
    font-size: 0.7vw;
    font-family: Noto Sans S Chinese;
    font-weight: 500;
    color: #ffffff;
  }
}
</style>
