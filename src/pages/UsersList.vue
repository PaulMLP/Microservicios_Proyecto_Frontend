<template>
  <div>
    <div class="row">
      <div class="col-md-6 col-12" @click="selected = 'card1'">
        <card id="tarjeta" :title="card1.title" :subTitle="card1.subTitle">
          <div class="espacio"></div>
        </card>
      </div>
      <div class="col-md-6 col-12" @click="selected = 'card2'">
        <card id="tarjeta" :title="card2.title" :subTitle="card2.subTitle">
          <div class="espacio"></div>
        </card>
      </div>
    </div>
    <Investigators v-if="selected === 'card1'" />
    <Responsibles v-if="selected === 'card2'" />
  </div>
</template>
<script>
import Investigators from "./Users/Investigators.vue";
import Responsibles from "./Users/Responsibles.vue";

export default {
  components: {
    Investigators,
    Responsibles,
  },
  name: "UsersList",
  data() {
    return {
      selected: null,
      card1: {
        title: "Investigadores",
        subTitle: "Lista de usuarios registrados con el rol de investigador",
      },
      card2: {
        title: "Responsables",
        subTitle: "Lista de usuarios registrados con el rol de responsable",
      },
    };
  },
  methods: {
    selectCard(card) {
      this.selected = card;
      console.log(`Selected card: ${this.selected}`);
    },
  },
};
</script>
<style scoped>
.espacio {
  height: 10px;
}
#tarjeta {
  cursor: pointer;
  transition: all 0.2s ease;
}
#tarjeta:hover {
  background-color: #d5d5d5;
  scale: 1.02;
  transition: all 0.2s ease;
}
</style>
