import { readFileSync } from "fs";
import { handler } from "./handler";

// Cargar JSON desde archivo
const event = JSON.parse(readFileSync("event.json", "utf-8"));

// Ejecutar la Lambda simulando AWS
handler(event)
  .then((response) => {
    console.log("Response:", response);
  })
  .catch((err) => {
    console.error("Error:", err);
  });
