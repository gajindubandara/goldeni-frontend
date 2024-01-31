import Dashboard from "../scenes/Dashboard";
import Devices from "../scenes/admin/Devices";
import Users from "../scenes/admin/Users";

export const routes = [
    { path: "/dashboard", component: Dashboard ,name:"Dashboard"},
    { path: "/devices", component: Devices ,name:"Devices", adminOnly: true},
    { path: "/users", component: Users ,name:"Users", adminOnly: true},
];

export default routes;
