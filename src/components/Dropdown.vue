<template>
  <component
    :is="tag"
    class="dropdown"
    :class="{ show: isOpen }"
    @click="toggleDropDown"
    v-click-outside="closeDropDown"
  >
    <a
      class="dropdown-toggle btn-rotate"
      :class="titleClasses"
      data-toggle="dropdown"
    >
      <slot name="title">
        <i :class="icon"></i>
        <span class="notification">
          {{ title }}
          <b class="caret"></b>
        </span>
      </slot>
    </a>

    <!-- ✅ Aquí está el cambio importante -->
    <ul class="dropdown-menu dropdown-menu-left" :class="{ show: isOpen }">
      <slot></slot>
    </ul>
  </component>
</template>

<script>
export default {
  props: {
    tag: {
      type: String,
      default: "li",
    },
    title: String,
    icon: String,
    titleClasses: [String, Object, Array],
  },
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    toggleDropDown() {
      this.isOpen = !this.isOpen;
      this.$emit("change", this.isOpen);
    },
    closeDropDown() {
      this.isOpen = false;
      this.$emit("change", false);
    },
  },
};
</script>
<style scoped>
.dropdown-menu-left {
  right: 0;
  left: auto;
  transform: translateX(-100%); /* Abre el menú hacia la izquierda */
}

.dropdown-menu {
  max-width: 300px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
}
</style>
