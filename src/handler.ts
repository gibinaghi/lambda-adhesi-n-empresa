import { Pool } from "pg";

// Configuración de la conexión a Postgres 
const pool = new Pool({
  host: process.env.DB_HOST,     
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const handler = async (event: any) => {
  const client = await pool.connect();
  try {
    const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;

    const requiredFields = ["nombre", "cuit", "tipo", "fecha_adhesion", "activa"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: `Falta el campo obligatorio: ${field}` }),
        };
      }
    }

    // Validación CUIT (11 dígitos)
    if (!/^\d{11}$/.test(body.cuit)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "CUIT inválido, debe tener 11 dígitos" }),
      };
    }

    // Insertar en Postgres
    const insertQuery = `
    INSERT INTO public.empresas
    (id, nombre, cuit, tipo, fecha_adhesion, activa, updated_at)
    VALUES($1, $2, $3, $4, $5, $6, $7)
    RETURNING id;
    `;

    const values = [
      "emp-050",
      body.nombre,
      body.cuit,
      body.tipo,
      body.fecha_adhesion,
      body.activa,
      new Date().toISOString(),
    ];

    const result = await client.query(insertQuery, values);

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Empresa registrada exitosamente",
        data: result.rows[0],
      }),
    };

  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno del servidor" }),
    };
  } finally {
    client.release();
  }
};
