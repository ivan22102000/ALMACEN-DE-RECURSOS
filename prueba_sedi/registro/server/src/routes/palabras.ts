// server/src/routes/palabras.ts

import { Router } from "express";
import { supabase } from "../supabaseClient";

export const router = Router();
// PUT /palabras/:id — actualiza el texto de una palabra
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { palabra } = req.body;
  if (typeof palabra !== "string") {
    return res.status(400).json({ error: "Campo 'palabra' inválido" });
  }

  const { data, error } = await supabase
    .from("contenedor")
    .update({ palabra: palabra.trim() })
    .eq("id_palabra", id)
    .select("id_palabra, palabra")
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// DELETE /palabras/:id — elimina una palabra por ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("contenedor")
    .delete()
    .eq("id_palabra", id)
    .select("id_palabra")
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ id_borrado: data.id_palabra });
});
