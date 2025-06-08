<template>
  <card class="card-user">
    <div slot="image">
      <img src="@/assets/img/background.jpg" alt="..." />
    </div>
    <div>
      <div class="author">
        <img
          class="avatar border-white"
          src="@/assets/img/faces/face-0.jpg"
          alt="..."
        />
        <h4 class="title">
          {{ name }}
          <br />
          <a href="#">
            <small>{{ mail }}</small>
          </a>
        </h4>
      </div>
      <p class="description text-center"></p>
    </div>
    <hr />
    <div class="text-center">
      <span>{{ role.toUpperCase() }}</span>
      <div class="row">
        <div
          v-for="(info, index) in details"
          :key="index"
          :class="getClasses(index)"
        >
          <h5>
            {{ info.title }}
            <br />
            <small>{{ info.subTitle }}</small>
          </h5>
        </div>
      </div>
    </div>
  </card>
</template>
<script>
export default {
  data() {
    return {
      name: "",
      mail: "",
      role: "",
      details: [],
    };
  },
  mounted() {
    try {
      this.role = this.$store.state.rol;
      this.name = this.$store.state.userDbData.nombre;
      this.mail = this.$store.state.userInfo.email;
      console.log(this.name);
    } catch (error) {}
  },
  methods: {
    getClasses(index) {
      var remainder = index % 3;
      if (remainder === 0) {
        return "col-lg-3 offset-lg-1";
      } else if (remainder === 2) {
        return "col-lg-4";
      } else {
        return "col-lg-3";
      }
    },
  },
};
</script>
<style></style>
