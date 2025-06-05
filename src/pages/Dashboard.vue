<template>
  <div>
    <!--Stats cards-->
    <div class="row">
      <div
        class="col-md-6 col-xl-3"
        v-for="stats in statsCards"
        :key="stats.title"
      >
        <stats-card>
          <div
            class="icon-big text-center"
            :class="`icon-${stats.type}`"
            slot="header"
          >
            <i :class="stats.icon"></i>
          </div>
          <div class="numbers" slot="content">
            <p>{{ stats.title }}</p>
            {{ stats.value }}
          </div>
          <div class="stats" slot="footer">
            <i :class="stats.footerIcon"></i> {{ stats.footerText }}
          </div>
        </stats-card>
      </div>
    </div>

    <!--Charts-->
    <div class="row">
      <div
        v-if="
          usersChart.data.labels.length > 0 && usersChart.data.series.length > 0
        "
        class="col-12"
      >
        <card style="margin-bottom: 0; border-radius: 5px 5px 0px 0px">
          <div class="row">
            <div class="col">
              <label>Año</label>
              <select
                v-model="anioSeleccionado"
                @change="actualizarGrafico"
                class="form-control"
              >
                <option
                  v-for="anio in aniosDisponibles"
                  :key="anio"
                  :value="anio"
                >
                  {{ anio }}
                </option>
              </select>
            </div>
            <div class="col">
              <label>Mes</label>
              <select
                v-model="mesSeleccionado"
                @change="actualizarGrafico"
                class="form-control"
              >
                <option
                  v-for="(nombre, index) in meses"
                  :key="index"
                  :value="index + 1"
                >
                  {{ nombre }}
                </option>
              </select>
            </div>
            <div class="col">
              <label>Día</label>
              <select
                v-model="diaSeleccionado"
                @change="actualizarGrafico"
                class="form-control"
              >
                <option v-for="dia in diasDelMes" :key="dia" :value="dia">
                  {{ dia }}
                </option>
              </select>
            </div>
          </div>
        </card>
        <chart-card
          style="border-radius: 0px 0px 5px 5px"
          title="Registro Usuarios"
          sub-title="Presentación de 24 horas"
          :chart-data="usersChart.data"
          class="col-12"
          :chart-options="usersChart.options"
        >
          <span slot="footer">
            <i class="ti-reload"></i> Ultima actualización {{ fechaExacta }}
          </span>
          <div slot="legend">
            <i class="fa fa-circle text-info"></i> Usuarios registrados hoy
          </div>
        </chart-card>
      </div>

      <div class="col-md-6 col-12">
        <chart-card
          v-if="users_rol"
          title="Estaditicas de usuarios"
          sub-title="Cantidad de usuarios por rol"
          :chart-data="preferencesChart.data"
          chart-type="Pie"
        >
          <span slot="footer">
            <i class="ti-server"></i> Conteo total de usuarios
            {{ usersCount }}</span
          >
          <div slot="legend">
            <i class="fa fa-circle text-warning"></i> Investigador(es)
            <i class="fa fa-circle text-info"></i> Responsable(s)
          </div>
        </chart-card>
        <div v-else class="spinner-container">
          <div class="spinner"></div>
        </div>
      </div>
      <div class="col-md-6 col-12">
        <chart-card
          v-if="projects_estado"
          title="Estaditicas de proyectos"
          sub-title="Cantidad de proyectos por estado"
          :chart-data="preferencesChartProj.data"
          chart-type="Pie"
        >
          <span slot="footer">
            <i class="ti-server"></i> Conteo total de proyectos
            {{ projectsCount }}</span
          >
          <div slot="legend">
            <i class="fa fa-circle text-warning"></i> Pendiente
            <i class="fa fa-circle text-info"></i> En Progreso
            <i class="fa fa-circle text-danger"></i> Finalizado
          </div>
        </chart-card>
        <div v-else class="spinner-container">
          <div class="spinner"></div>
        </div>
      </div>

      <div
        v-if="
          activityProjectChart.data.labels.length > 0 &&
          activityProjectChart.data.series.length > 0
        "
        class="col-12"
      >
        <card style="margin-bottom: 0; border-radius: 5px 5px 0px 0px">
          <div class="col">
            <label>Año</label>
            <select
              v-model="anioSelecProj"
              @change="actualizarGraficoProj"
              class="form-control"
            >
              <option
                v-for="anio in aniosDisponibles"
                :key="anio"
                :value="anio"
              >
                {{ anio }}
              </option>
            </select>
          </div></card
        >

        <chart-card
          style="margin-bottom: 0; border-radius: 0px 0px 5px 5px"
          :title="'Proyectos' + anioSelecProj"
          sub-title="Todos los proyectos según la fecha de inicio"
          :chart-data="activityProjectChart.data"
          :chart-options="activityProjectChart.options"
        >
          <span slot="footer">
            <i class="ti-reload"></i> Ultima actualización {{ fechaExacta }}
          </span>
          <div slot="legend">
            <i class="fa fa-circle text-info"></i> Proyectos del mes
          </div>
        </chart-card>
      </div>
    </div>
  </div>
</template>
<script>
import { StatsCard, ChartCard } from "@/components/index";
import {
  contarTodosUsuariosFachada,
  contarUsuariosRolFachada,
  contarUsuariosHoraFachada,
} from "@/clients/users.js";
import {
  contarTodosProyectosFachada,
  contarEstadosProyectosFachada,
  contarProyectosMesFachada,
} from "@/clients/projects.js";
import { contarTodosArchivosFachada } from "@/clients/documents.js";
import { contarTodosEventosFachada } from "@/clients/agenda.js";

import Chartist from "chartist";
export default {
  components: {
    StatsCard,
    ChartCard,
  },
  data() {
    return {
      usersCount: null,
      projectsCount: null,
      archivesCount: null,
      eventsCount: null,
      users_rol: false,
      projects_estado: false,
      statsCards: [],
      fechaExacta: "",
      meses: [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ],

      datosDelBackend: null,
      anioSeleccionado: new Date().getFullYear(),
      mesSeleccionado: new Date().getMonth() + 1,
      diaSeleccionado: new Date().getDate(),
      datosDelBackProj: null,

      anioSelecProj: new Date().getFullYear(),
      usersChart: {
        data: {
          labels: [],
          series: [],
        },
        options: {
          height: "270px",
          axisX: {
            showGrid: false,
          },
          lineSmooth: Chartist.Interpolation.simple({
            divisor: 3,
          }),
          showLine: true,
          showPoint: false,
        },
      },
      activityProjectChart: {
        data: {
          labels: [],
          series: [],
        },
        options: {
          seriesBarDistance: 10,
          axisX: {
            showGrid: false,
          },
          height: "245px",
        },
      },
      preferencesChart: {
        data: {
          labels: [],
          series: [],
        },
        options: {},
      },
      preferencesChartProj: {
        data: {
          labels: [],
          series: [],
        },
        options: {},
      },
    };
  },
  async mounted() {
    try {
      const [usuarios, proyectos, archivos, eventos] = await Promise.all([
        contarTodosUsuariosFachada(),
        contarTodosProyectosFachada(),
        contarTodosArchivosFachada(),
        contarTodosEventosFachada(),
      ]);

      this.usersCount = usuarios ?? 0;
      this.projectsCount = proyectos ?? 0;
      this.archivesCount = archivos ?? 0;
      this.eventsCount = eventos ?? 0;

      const rolesCantidad = await contarUsuariosRolFachada();

      if (rolesCantidad && typeof rolesCantidad === "object") {
        const { responsable = 0, investigador = 0 } = rolesCantidad;

        this.users_rol = true;

        this.preferencesChart.data.labels = ["Responsable", "Investigador"];

        this.preferencesChart.data.series = [responsable, investigador];
      } else {
        // No hay datos de roles, asignar vacíos para evitar errores en el gráfico
        this.preferencesChart.data.labels = [];
        this.preferencesChart.data.series = [];
        this.users_rol = false;
      }
    } catch (error) {
      console.error("Error al obtener datos del dashboard:", error);

      // Asignar valores por defecto en caso de error
      this.usersCount = 0;
      this.projectsCount = 0;
      this.archivesCount = 0;
      this.eventsCount = 0;
      this.preferencesChart.data.labels = [];
      this.preferencesChart.data.series = [];
      this.users_rol = false;
    }

    const estados = await contarEstadosProyectosFachada();
    if (estados) {
      this.projects_estado = true;
    }

    const resultado = {};

    estados.forEach(({ estado, cantidad }) => {
      resultado[estado] = cantidad;
    });

    this.preferencesChartProj.data.labels = [
      resultado.en_progreso || "",
      resultado.pendiente || "",
      resultado.finalizado || "",
    ];

    this.preferencesChartProj.data.series = [
      resultado.en_progreso || 0,
      resultado.pendiente || 0,
      resultado.finalizado || 0,
    ];

    this.datosDelBackend = await contarUsuariosHoraFachada();
    this.actualizarGrafico();

    this.statsCards = [
      {
        type: "warning",
        icon: "ti-folder",
        title: "Proyectos",
        value: this.projectsCount,
        footerText: "Conteo de proyectos",
        footerIcon: "ti-archive",
      },
      {
        type: "default",
        icon: "ti-user",
        title: "Usuarios",
        value: this.usersCount,
        footerText: "Conteo de usuarios",
        footerIcon: "ti-archive",
      },
      {
        type: "danger",
        icon: "ti-file",
        title: "Archivos",
        value: this.archivesCount,
        footerText: "Conteo de archivos",
        footerIcon: "ti-archive",
      },
      {
        type: "info",
        icon: "ti-agenda",
        title: "Eventos",
        value: this.eventsCount,
        footerText: "Conteo de eventos",
        footerIcon: "ti-archive",
      },
    ];

    this.datosDelBackProj = await contarProyectosMesFachada();
    this.actualizarGraficoProj();
  },
  computed: {
    aniosDisponibles() {
      const actual = new Date().getFullYear();
      return [actual - 1, actual, actual + 1];
    },
    diasDelMes() {
      return Array.from(
        {
          length: new Date(
            this.anioSeleccionado,
            this.mesSeleccionado,
            0,
          ).getDate(),
        },
        (_, i) => i + 1,
      );
    },
  },
  methods: {
    async actualizarGrafico() {
      this.usersChart.data = { labels: [], series: [] };

      const fecha = new Date();
      const fechaFormateada = fecha.toLocaleDateString("es-ES");
      const horaFormateada = fecha.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      this.fechaExacta = `${fechaFormateada} ${horaFormateada}`;

      this.usersChart.data = await this.generarChartDataPorHora(
        this.datosDelBackend,
        this.anioSeleccionado,
        this.mesSeleccionado,
        this.diaSeleccionado,
      );
    },
    generarChartDataPorHora(datos, anio, mes, dia) {
      const bloques = Array(8).fill(0);

      datos.forEach((item) => {
        const [anioDato, mesDato, diaDato] = item.dia.split("-").map(Number);

        if (anioDato === anio && mesDato === mes && diaDato === dia) {
          const hora = Number(item.hora);

          const bloqueIndex = Math.min(Math.floor(hora / 4), 5);
          bloques[bloqueIndex + 1] += item.cantidad;
        }
      });

      return {
        labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
        series: [bloques],
      };
    },
    async actualizarGraficoProj() {
      this.activityProjectChart.data = { labels: [], series: [] };

      const fecha = new Date();
      const fechaFormateada = fecha.toLocaleDateString("es-ES"); // 27/5/2025
      const horaFormateada = fecha.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      this.fechaExacta = `${fechaFormateada} ${horaFormateada}`;

      this.activityProjectChart.data = await this.generarChartProj(
        this.datosDelBackProj,
        this.anioSelecProj,
      );
    },

    generarChartProj(data, anioSeleccionado) {
      const labels = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ];
      const series = Array(12).fill(0); // Inicializar 12 meses con 0

      data.forEach((item) => {
        const mesIndex = item.mes - 1; // Ajustar porque meses vienen 1..12
        const anio = item.anio;

        if (anio === anioSeleccionado && mesIndex >= 0 && mesIndex < 12) {
          series[mesIndex] += item.cantidad;
        }
      });

      return {
        labels,
        series: [series], // Envolvemos en array para Chartist
      };
    },
  },
};
</script>
<style></style>
