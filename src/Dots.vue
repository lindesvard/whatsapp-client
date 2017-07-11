<template lang="html">
  <div class="dots">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
  </div>
</template>

<style lang="css">
/*Huge thanks to @tobiasahlin at http://tobiasahlin.com/spinkit/ */
.dots {
  margin: 0;
  width: 40px;
  display: inline-block;
  position: absolute;
  right: 0;
  padding-left: 5px;
}

.dots > div {
  width: 8px;
  height: 8px;
  background-color: #e5ddd5;

  border-radius: 100%;
  display: inline-block;
  -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  animation: sk-bouncedelay 1.4s infinite ease-in-out both;
}

.dots .bounce1 {
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}

.dots .bounce2 {
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}

@-webkit-keyframes sk-bouncedelay {
  0%, 80%, 100% { -webkit-transform: scale(0) }
  40% { -webkit-transform: scale(1.0) }
}

@keyframes sk-bouncedelay {
  0%, 80%, 100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  } 40% {
    -webkit-transform: scale(1.0);
    transform: scale(1.0);
  }
}
</style>
