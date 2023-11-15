import Dashboard from "../scenes/Dashboard";
import Devices from "../scenes/admin/Devices";
import Users from "../scenes/admin/Users";

export const routes = [
    { path: "/dashboard", component: Dashboard ,name:"Dashboard"},
    { path: "/devices", component: Devices ,name:"Devices"},
    { path: "/users", component: Users ,name:"Users"},
];

export default routes;
