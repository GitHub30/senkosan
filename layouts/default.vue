<template>
  <div>
    <nuxt />
    <!-- eslint-disable vue/html-indent -->
    <!-- eslint-disable vue/html-closing-bracket-newline -->
    <a
      href="https://github.com/googlecreativelab/teachablemachine-libraries/tree/master/audio"
      class="tfjs"
      target="_blank"
      >Powered by TensorFlow.js</a
    >
  </div>
</template>

<style>
html {
  font-family: LightNovel, 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

body {
  background: url('~assets/background2.png');
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}

.tfjs {
  position: fixed;
  bottom: 0;
  margin: 16px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 20px;
}
</style>
