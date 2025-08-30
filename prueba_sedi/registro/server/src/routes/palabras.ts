// server/src/routes/palabras.ts

import { Router } from "express";
import { supabase } from "../supabaseClient";

export const router = Router();

/**
 * GET /palabras
 * Devuelve todas las filas de `contenedor` ordenadas por id_palabra.
 */
router.get("/", async (_req, res) => {
  console.log("⟳ GET /palabras recibida");

  try {
    const { data, error } = await supabase
      .from("contenedor")
      .select("id_palabra, palabra")
      .order("id_palabra", { ascending: true });

    if (error) {
      console.error("❌ Error de Supabase al leer:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (err) {
    console.error("💥 Error inesperado en GET /palabras:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

/**
 * POST /palabras
 * Inserta una nueva fila en `contenedor` y devuelve
 * la fila recién creada.
 */
router.post("/", async (req, res) => {
  console.log("⟳ POST /palabras recibida, body:", req.body);

  const { palabra } = req.body;
  if (typeof palabra !== "string" || palabra.trim() === "") {
    return res.status(400).json({ error: "Campo 'palabra' inválido o vacío" });
  }

  try {
    // Le indicamos a Supabase que nos devuelva la fila insertada
    const { data, error } = await supabase
      .from("contenedor")
      .insert(
        [{ palabra: palabra.trim() }],
        { returning: "representation" }
      );

    if (error) {
      console.error("❌ Error de Supabase al insertar:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log("✅ Inserción exitosa:", data);
    // `data` es un array; devolvemos el primer (y único) objeto
    return res.status(201).json(data![0]);
  } catch (err) {
    console.error("💥 Error inesperado en POST /palabras:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});
