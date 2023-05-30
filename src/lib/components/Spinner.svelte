<script>
  export let dark = true;
</script>

<svg
  class="spinner"
  width="18px"
  height="18px"
  viewBox="0 0 66 66"
  xmlns="http://www.w3.org/2000/svg"
>
  <circle
    class="path"
    style={dark ? "stroke: rgb(48, 42, 42)" : ""}
    fill="none"
    stroke-width="6"
    stroke-linecap="round"
    cx="33"
    cy="33"
    r="30"
  />
</svg>

<style>
  .spinner {
    -webkit-animation: rotator 1.4s linear infinite;
    animation: rotator 1.4s linear infinite;
  }

  @-webkit-keyframes rotator {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(270deg);
    }
  }

  @keyframes rotator {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(270deg);
    }
  }
  .path {
    stroke-dasharray: 187;
    stroke-dashoffset: 0;
    stroke: #ffffff;
    transform-origin: center;
    -webkit-animation: dash 1.4s ease-in-out infinite;
    animation: dash 1.4s ease-in-out infinite;
  }

  @-webkit-keyframes dash {
    0% {
      stroke-dashoffset: 187;
    }
    50% {
      stroke-dashoffset: 46.75;
      transform: rotate(135deg);
    }
    100% {
      stroke-dashoffset: 187;
      transform: rotate(450deg);
    }
  }
  @keyframes dash {
    0% {
      stroke-dashoffset: 187;
    }
    50% {
      stroke-dashoffset: 46.75;
      transform: rotate(135deg);
    }
    100% {
      stroke-dashoffset: 187;
      transform: rotate(450deg);
    }
  }
</style>
