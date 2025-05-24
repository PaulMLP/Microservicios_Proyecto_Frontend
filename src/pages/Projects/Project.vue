<template>
  <div>
    <div class="card-header">
      <h4>{{ projectAux.titulo }}</h4>
      <button class="exit" @click="exit"><span class="ti-close"></span></button>
    </div>

    <p>{{ projectAux.descripcion }}</p>

    <!-- Estado visual -->
    <div class="status" :class="estadoClase">
      <span>{{ mensajeEstado }}</span>
    </div>

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
    <hr />
    <Documents v-if="selected === 'card1'" :project="project.id"/>
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
        subTitle: "Todos los documentos agregados al proyecto",
      },
      card2: {
        title: "Tareas del Proyecto",
        subTitle: "Gestión de tareas del proyecto",
      },
    };
  },
  computed: {
    estadoClase() {
      const estado = (this.projectAux.estado || "").toLowerCase().trim();
      switch (estado) {
        case "en_progreso":
          return "estado-verde";
        case "pendiente":
          return "estado-amarillo";
        case "finalizado":
          return "estado-gris";
        case "cancelado":
          return "estado-rojo";
        default:
          return "estado-default";
      }
    },
    mensajeEstado() {
      const estado = (this.projectAux.estado || "").toLowerCase().trim();

      switch (estado) {
        case "en_progreso":
          return "Proyecto en progreso";
        case "pendiente":
          return "Pendiente de aprobación";
        case "finalizado":
          return "Proyecto finalizado";
        case "cancelado":
          return "Proyecto cancelado";
        default:
          return "Estado desconocido";
      }
    },
  },
  mounted() {
    this.projectAux = this.project;
    this.estadoClase;
    this.mensajeEstado;
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

.status {
  display: flex;
  align-items: center;
  height: 30px;
  margin: 15px 0px;
  border-radius: 5px;
  color: white;
  padding: 10px 5px;
}

.estado-verde {
  background-color: #38a169;
}

.estado-amarillo {
  background-color: #d69e2e;
}

.estado-gris {
  background-color: #4a5568;
}

.estado-rojo {
  background-color: #e53e3e;
}

.estado-default {
  background-color: #3182ce;
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
</style>
