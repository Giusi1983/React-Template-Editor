// src/store/editorSlice.js
import { createSlice } from "@reduxjs/toolkit";

const editorSlice = createSlice({
  name: "editor",
  initialState: {
    html: "", // Stato per memorizzare l'HTML generato da GrapesJS
    css: "", // Stato per memorizzare il CSS generato da GrapesJS
  },
  reducers: {
    // Azione per salvare il progetto (HTML e CSS)
    saveProject: (state, action) => {
      state.html = action.payload.html; // Salva l'HTML nel Redux store
      state.css = action.payload.css; // Salva il CSS nel Redux store
    },
    // Azione per caricare il progetto (in questo esempio, manteniamo lo stato immutato)
    loadProject: (state) => state,
  },
});

// Esportare le azioni per essere usate nel componente
export const { saveProject, loadProject } = editorSlice.actions;

// Esportare il reducer per essere usato nella configurazione del Redux store
export default editorSlice.reducer;
