// src/components/grapesjsEditor.js
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import { saveProject, loadProject } from "../store/editorSlice";
import { saveAs } from "file-saver";
import "../css/editor.css"; // Importa il file CSS correttamente

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

  //funzione per scaricare il template come file HTML
  const downloadHtmlFile = () => {
    const editor = editorRef.current;
    const html = editor.getHtml();
    const css = editor.getCss();
    const fullHtml = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>${css}</style>
  </head>
  <body>${html}</body>
  </html>
  `;
    const blob = new Blob([fullHtml], { type: "text/html" });
    saveAs(blob, "template.html");
  };

  // funzione per scaricare il template come file word

  const downloadWordFile = () => {
    const editor = editorRef.current;
    const html = editor.getHtml();
    const css = editor.getCss();
    const fullHtml = `
  <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset="utf-8"><title>Document</title><style>${css}</style></head>
    <body>${html}</body>
  </html>
`;
    const blob = new Blob([fullHtml], { type: "application/msword" });
    saveAs(blob, "template.doc");
  };

  // funzione per caricare un file HTML nell'interfaccia
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      const editor = editorRef.current;

      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");
      const htmlContent = doc.body.innerHTML;
      const cssContent = doc.querySelector("style")
        ? doc.querySelector("style").innerHTML
        : "";

      editor.setComponents(htmlContent);
      editor.setStyle(cssContent);
    };

    reader.readAsText(file);
  };

  return (
    <div className="editor-container">
      {" "}
      {/* Use the class name here */}
      <div className="block-manager" id="blocks">
        {" "}
        {/* Block manager styling */}
        {/* Content for block manager */}
      </div>
      <div className="gjs-editor" id="gjs">
        {" "}
        {/* GrapesJS editor area */}
        {/* GrapesJS editor content */}
      </div>
      <div className="control-panel">
        {" "}
        {/* Control panel styling */}
        <button className="btn-control" onClick={handleSave}>
          Save
        </button>
        <button className="btn-control" onClick={handleLoad}>
          Load
        </button>
        <button className="btn-control" onClick={downloadHtmlFile}>
          Download HTML
        </button>
        <button className="btn-control" onClick={downloadWordFile}>
          Download Word
        </button>
        <input
          type="file"
          accept=".html"
          onChange={handleFileUpload}
          className="file-upload" // Styled file upload input
        />
      </div>
    </div>
  );
};

export default GrapesJSEditor;
