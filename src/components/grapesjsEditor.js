// src/components/grapesjsEditor.js
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import { saveProject, loadProject } from "../store/editorSlice";

const GrapesJSEditor = () => {
  const editorRef = useRef(null);
  const dispatch = useDispatch();
  const { html, css } = useSelector((state) => state.editor);

  useEffect(() => {
    if (!editorRef.current) {
      const editor = grapesjs.init({
        container: "#gjs",
        height: "100vh",
        fromElement: true,
        storageManager: false,
        blockManager: {
          appendTo: "#blocks", // Il Block Manager è inserito nel div "blocks"
        },
        panels: {
          defaults: [
            {
              id: "panel-top",
              el: ".panel__top",
              buttons: [
                {
                  id: "visibility",
                  active: true,
                  className: "btn-toggle-borders",
                  label: "Visibility",
                  command: "sw-visibility", // Comando per mostrare/nascondere bordi
                },
              ],
            },
          ],
        },
      });

      editorRef.current = editor;

      // Se ci sono dati nel Redux store, carica il progetto
      if (html || css) {
        editor.setComponents(html);
        editor.setStyle(css);
      }

      // Aggiungi blocchi di esempio
      editor.BlockManager.add("block-title", {
        label: "Titolo",
        content: "<h1>Put your title here</h1>",
        category: "Basic",
      });
      editor.BlockManager.add("block-image", {
        label: "Immagine",
        content: '<img src="https://via.placeholder.com/350x350" alt="Image"/>',
        category: "Basic",
      });
    }
  }, [html, css]);

  // Funzione per salvare l'HTML e il CSS nel Redux store
  const handleSave = () => {
    const editor = editorRef.current;
    const html = editor.getHtml();
    const css = editor.getCss();
    dispatch(saveProject({ html, css }));
  };

  // Funzione per caricare il progetto dal Redux store
  const handleLoad = () => {
    dispatch(loadProject({ html, css }));
    const editor = editorRef.current;
    editor.setComponents(html);
    editor.setStyle(css);
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Container per il Block Manager */}
      <div
        id="blocks"
        style={{
          width: "250px",
          backgroundColor: "#f0f0f0",
          padding: "10px",
          borderRight: "1px solid #ddd",
          overflowY: "auto",
        }}
      ></div>

      {/* Container dell'editor GrapesJS */}
      <div id="gjs" style={{ flex: 1, border: "1px solid #ddd" }}></div>

      {/* Pulsanti di controllo */}
      <div
        style={{
          width: "150px",
          backgroundColor: "#f7f7f7",
          padding: "10px",
          borderLeft: "1px solid #ddd",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          onClick={handleSave}
          style={{
            marginBottom: "10px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Save
        </button>
        <button
          onClick={handleLoad}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Load
        </button>
      </div>
    </div>
  );
};

export default GrapesJSEditor;
