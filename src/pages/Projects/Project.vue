<template>
  <div>
    <div class="card-header">
      <h4>{{ projectAux.titulo }}</h4>
      <button class="exit" @click="exit"><span class="ti-close"></span></button>
    </div>

    <p>{{ projectAux.descripcion }}</p>
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
    <Documents v-if="selected === 'card1'" />
    <Tasks v-if="selected === 'card2'" />
  </div>
</template>
<script>
import { StatsCard, Documents } from "@/components/index";
import Tasks from "@/components/Tasks.vue";
export default {
  components: {
    StatsCard,
    Documents,
    Tasks,
  },
  props: {
    project: Object,
  },
  data() {
    return {
      projectAux: this.project || {},
      selected: null,
      card1: {
        title: "Documentos del Proyecto",
        subTitle: "Todos los docuemntos agregados al proyecto",
      },
      card2: {
        title: "Tareas del Proyecto",
        subTitle: "Gestión de tareas del proyecto",
      },
    };
  },

  mounted() {
    this.projectAux = this.project;
  },

  methods: {
    exit() {
      this.$emit("exit", true);
    },
  },
};
</script>
<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  height: fit-content;
  padding: 1%;

  h4 {
    margin: 0;
  }
}

.exit {
  background-color: gainsboro;
  border: none;
  padding: 4px 8px;
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
