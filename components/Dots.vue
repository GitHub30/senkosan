<template>
  <div class="Dots">
    <div class="Circle Circle--blue" />
    <div class="Circle Circle--red" />
    <div class="Circle Circle--yellow" />
    <div class="Circle Circle--green" />
  </div>
</template>

<style>
.Dots {
  display: flex;
}

.Circle {
  margin: 8px;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  will-change: transform;
  transform: translateY(-8px);
}

.Circle--blue {
  background: #4285f4;
  animation: updown 0.8s ease-in-out -0.75s infinite alternate;
}

.Circle--red {
  background: #db4437;
  animation: updown 0.8s ease-in-out -0.5s infinite alternate;
}

.Circle--yellow {
  background: #f4b400;
  animation: updown 0.8s ease-in-out -0.25s infinite alternate;
}

.Circle--green {
  background: #0f9d58;
  animation: updown 0.8s ease-in-out infinite alternate;
}

@keyframes updown {
  100% {
    transform: translateY(8px);
  }
}
</style>
