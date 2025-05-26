<template>
  <div :class="{ 'nav-open': $sidebar.showSidebar }">
    <notifications></notifications>
    <router-view></router-view>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.vue-notifyjs.notifications {
  .alert {
    z-index: 10000;
  }
  .list-move {
    transition:
      transform 0.3s,
      opacity 0.4s;
  }
  .list-item {
    display: inline-block;
    margin-right: 10px;
  }
  .list-enter-active {
    transition:
      transform 0.2s ease-in,
      opacity 0.4s ease-in;
  }
  .list-leave-active {
    transition:
      transform 1s ease-out,
      opacity 0.4s ease-out;
  }

  .list-enter {
    opacity: 0;
    transform: scale(1.1);
  }
  .list-leave-to {
    opacity: 0;
    transform: scale(1.2, 0.7);
  }
}

.exit {
  background-color: gainsboro;
  border: none;
  padding: 4px 8px;
  margin: 0;
  cursor: pointer;
  font-size: 15px;
  border-radius: 5px;
  color: #000;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.exit:hover {
  background-color: #d5d5d5;
  transition: all 0.2s ease;
}

.spinner-container {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #ccc;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.text-danger {
  color: #e7372b;
  font-size: 13px;
  margin-top: 4px;
  display: block;
}

#button-agregar {
  border-radius: 4px;
  background-color: #f5dfbb;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  margin: 15px 10px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

#button-agregar:hover {
  scale: 1.02;
  transition: all 0.2s ease;
  cursor: pointer;
}

.botones {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 5px;
}

@import "~vue-multiselect/dist/vue-multiselect.min.css";
</style>
