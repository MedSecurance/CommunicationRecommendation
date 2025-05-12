import RiskAssessment from "layouts/riskassesment";
import DeviceManager from "layouts/device-manager";
import ActivityLog from "layouts/activity-log";
import DeviceDetails from "layouts/device-manager/components/device-details/index";
import Account from "./Account"
// @mui icons
import Icon from "@mui/material/Icon";
import AdminConfig from "./layouts/admin-config";

const routes = [
  {
    type: "collapse",
    name: "Risk Assessment",
    key: "riskassessment",
    icon: <Icon fontSize="small">grading</Icon>,
    route: "/riskassessment",
    component: <RiskAssessment />,
    roles: ["User","Admin", "SecurityAnalyst", "RegulatoryBodies"], 
  },
  {
    type: "collapse",
    name: "Device Manager",
    key: "devicemanager",
    icon: <Icon fontSize="small">device_hub</Icon>,
    route: "/devicemanager",
    component: <DeviceManager />,
    roles: ["User","Admin", "SecurityAnalyst", "RegulatoryBodies"], 
  },
  {
    type: "title",
    name: "Device Details",
    key: "devicedetails",
    route: "/devicemanager/:deviceId",
    component: <DeviceDetails />,
    roles: ["User","Admin" , "SecurityAnalyst", "RegulatoryBodies"], 
  },
  {
    type: "collapse",
    name: "Admin Config Panel",
    key: "adminconfig",
    icon: <Icon fontSize="small">admin_panel_settings</Icon>,
    route: "/adminconfig",
    component: <AdminConfig />,
    roles: ["Admin", "User"], 
  },
  {
    type: "title",
    name: "Manage Account",
    key: "account",
    route: "/account",
    component: <Account />,
    roles: ["User","Admin", "SecurityAnalyst", "RegulatoryBodies"], 
  },
  {
    type: "collapse",
    name: "Activity Log",
    key: "activityLog",
    icon: <Icon fontSize="small">history_toggle_off</Icon>,
    route: "/activityLog",
    component: <ActivityLog />,
    roles: ["Admin"]
  }
];

export default routes;

