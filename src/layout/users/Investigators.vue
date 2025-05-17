<template>
  <div class="row">
    <div class="col-12">
      <card :title="table1.title" :subTitle="table1.subTitle">
        <div slot="raw-content" class="table-responsive">
          <user-table :data="table1.data" :columns="table1.columns">
          </user-table>
        </div>
      </card>
    </div>
  </div>
</template>
<script>
import { UserTable } from "@/components";
const tableColumns = ["Id", "Nombre", "Correo"];
const tableData = [
  {
    id: 1,
    nombre: "Dakota Rice",
    correo: "dk@mail.com",
  },
  {
    id: 2,
    nombre: "Minerva Hooper",
    correo: "min@mail.com",
  },
  {
    id: 3,
    nombre: "Sage Rodriguez",
    correo: "sa@mail.com",
  },
  {
    id: 4,
    nombre: "Philip Chaney",
    correo: "pc@mail.com",
  },
  {
    id: 5,
    nombre: "Doris Greene",
    correo: "dg@mail.com",
  },
];

export default {
  components: {
    UserTable,
  },
  name: "Investigators",
  data() {
    return {
      table1: {
        title: "Investigadores",
        subTitle: "",
        columns: [...tableColumns],
        data: [...tableData],
      },
    };
  },
};
</script>
<style></style>
