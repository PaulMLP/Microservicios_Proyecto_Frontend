<template>
  <div>
    <div v-if="add">
      <button id="button-agregar" @click="$emit('add')">
        Agregar <span class="ti-plus"></span>
      </button>
    </div>
    <table v-if="data[0]" class="table" :class="tableClass">
      <thead>
        <slot name="columns">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :style="{ width: column.width || 'auto' }"
            >
              {{ column.label }}
            </th>
          </tr>
        </slot>
      </thead>
      <tbody>
        <tr
          id="row-ctm"
          v-for="(item, index) in tableData"
          :key="index"
          @click="open(item.id)"
          style="cursor: pointer"
        >
          <slot :row="item">
            <td
              v-for="(column, index) in columns"
              :key="index"
              :style="{ width: column.width || 'auto' }"
              v-if="hasValue(item, column.key)"
              :title="itemValue(item, column.key)"
            >
              {{ itemValue(item, column.key) }}
            </td>
          </slot>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "DataTable",
  props: {
    add: {
      type: Boolean,
      default: true,
    },
    columns: {
      type: Array,
      default: () => [],
    },
    tableData: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String, // striped | hover
      default: "hover",
    },
    title: {
      type: String,
      default: "",
    },
    subTitle: {
      type: String,
      default: "",
    },
  },
  computed: {
    tableClass() {
      return `table-${this.type}`;
    },
  },
  methods: {
    open(id) {
      const item = this.getItemById(this.data, id);
      this.$emit("open", item);
    },
    hasValue(item, key) {
      return item[key] !== undefined;
    },
    itemValue(item, key) {
      return item[key];
    },
    getItemById(data, id) {
      return data.find((i) => i.id === id) || null;
    },
  },
};
</script>

<style scoped>
table {
  table-layout: fixed;
  width: 100%;
  margin-top: 10px;
}

th {
  background-color: #000022;
  color: #fbf5f3;
  font-weight: bold;
  text-align: left;
}

th,
td {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 8px;
  border-bottom: 1px solid #ddd;
}

#row-ctm:hover {
  color: #0e9594;
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
</style>
