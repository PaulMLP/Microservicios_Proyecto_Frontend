import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";

// Admin pages
import Dashboard from "@/pages/Dashboard.vue";
import UserProfile from "@/pages/UserProfile.vue";
import Notifications from "@/pages/Notifications.vue";
import Icons from "@/pages/Icons.vue";
import Maps from "@/pages/Maps.vue";
import Typography from "@/pages/Typography.vue";
import TableList from "@/pages/TableList.vue";
import UsersList from "@/pages/UsersList.vue";
import ProjectsList from "@/pages/ProjectsList.vue";
import UserProjectsList from "@/pages/UserProjectsList.vue";
import UserTasksList from "@/pages/UserTasksList.vue";

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: Dashboard,
      },
      {
        path: "stats",
        name: "estatisticas",
        component: UserProfile,
      },
      {
        path: "notifications",
        name: "notificaciones",
        component: Notifications,
      },
      {
        path: "icons",
        name: "icons",
        component: Icons,
      },
      {
        path: "maps",
        name: "maps",
        component: Maps,
      },
      {
        path: "typography",
        name: "typography",
        component: Typography,
      },
      {
        path: "table-list",
        name: "table-list",
        component: TableList,
      },
      {
        path: "users-list",
        name: "Lista de Usuarios",
        component: UsersList,
        meta: { allowedRoles: ["admin"] }, // Solo admins
      },
      {
        path: "projects",
        name: "proyectos",
        component: ProjectsList,
        meta: { allowedRoles: ["admin"] }, // Solo admins
      },
      {
        path: "my-projects",
        name: "Mis Proyectos",
        component: UserProjectsList,
        meta: { allowedRoles: ["investigador", "responsable"] }, // Investigador y responsable
      },
      {
        path: "my-tasks",
        name: "Mis Tareas",
        component: UserTasksList,
        meta: { allowedRoles: ["investigador", "responsable"] }, // Investigador y responsable
      },
    ],
  },
  { path: "*", component: NotFound },
];

export default routes;