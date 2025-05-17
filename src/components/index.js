import FormGroupInput from "./Inputs/formGroupInput.vue";

import DropDown from "./Dropdown.vue";
import PaperTable from "./PaperTable.vue";
import Button from "./Button";

import Card from "./Cards/Card.vue";
import ChartCard from "./Cards/ChartCard.vue";
import StatsCard from "./Cards/StatsCard.vue";

import SidebarPlugin from "./SidebarPlugin/index";
import UserTable from "./UserTable.vue";

import Investigators from "@/layout/users/Investigators.vue";
import Responsibles from "@/layout/users/Responsibles.vue";

let components = {
  FormGroupInput,
  Card,
  ChartCard,
  StatsCard,
  PaperTable,
  UserTable,
  DropDown,
  SidebarPlugin,
  Responsibles,
  Investigators,
};

export default components;

export {
  FormGroupInput,
  Card,
  ChartCard,
  StatsCard,
  PaperTable,
  UserTable,
  DropDown,
  Button,
  SidebarPlugin,
  Responsibles,
  Investigators,
};
