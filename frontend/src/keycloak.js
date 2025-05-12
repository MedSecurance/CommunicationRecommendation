import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: process.env.REACT_APP_KEYCLOAK_URL || "http://localhost:8081",
  realm: "MedSec",
  clientId: "med-sec-portal",
});

export default keycloak;
