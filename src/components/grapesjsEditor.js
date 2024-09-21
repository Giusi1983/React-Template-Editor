import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import { saveProject, loadProject } from "../store/editorSlice";
import { saveAs } from "file-saver";
import "../css/editor.css";

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
          appendTo: "#blocks",
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
                  command: "sw-visibility",
                },
              ],
            },
          ],
        },
      });

      editorRef.current = editor;

      if (html || css) {
        editor.setComponents(html);
        editor.setStyle(css);
      }

      // Aggiungi blocchi aggiuntivi
      editor.BlockManager.add("block-title", {
        label: "Titolo",
        content: "<h1>Inserisci il tuo titolo qui</h1>",
        category: "Basic",
      });

      editor.BlockManager.add("block-subtitle", {
        label: "Sottotitolo",
        content: "<h2>Inserisci il sottotitolo</h2>",
        category: "Basic",
      });

      editor.BlockManager.add("block-image", {
        label: "Immagine",
        content: '<img src="https://via.placeholder.com/350x350" alt="Image"/>',
        category: "Basic",
      });

      editor.BlockManager.add("block-qr-code", {
        label: "QR Code",
        content:
          '<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=www.esempio.com" alt="QR Code"/>',
        category: "Media",
      });

      editor.BlockManager.add("block-logo", {
        label: "Logo",
        content: '<img src="https://via.placeholder.com/150x50" alt="Logo"/>',
        category: "Basic",
      });

      editor.BlockManager.add("block-social-icons", {
        label: "Social Media Icons",
        content: `
          <div>
            <a href="#"><img src="https://via.placeholder.com/30" alt="Facebook" /></a>
            <a href="#"><img src="https://via.placeholder.com/30" alt="Twitter" /></a>
            <a href="#"><img src="https://via.placeholder.com/30" alt="Instagram" /></a>
          </div>
        `,
        category: "Media",
      });

      editor.BlockManager.add("block-embed-html", {
        label: "Embed HTML",
        content:
          '<div><h2>Inserisci il codice HTML</h2><textarea placeholder="Codice HTML qui..."></textarea></div>',
        category: "Advanced",
      });
    }
  }, [html, css]);

  const handleSave = () => {
    const editor = editorRef.current;
    const html = editor.getHtml();
    const css = editor.getCss();
    dispatch(saveProject({ html, css }));
  };

  const handleLoad = () => {
    dispatch(loadProject({ html, css }));
    const editor = editorRef.current;
    editor.setComponents(html);
    editor.setStyle(css);
  };

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

  return (
    <div className="editor-container">
      <div className="block-manager" id="blocks"></div>
      <div className="gjs-editor" id="gjs"></div>
      <div className="control-panel">
        <button className="btn-control" onClick={handleSave}>
          Save
        </button>
        <button className="btn-control" onClick={handleLoad}>
          Load
        </button>
        <button className="btn-control" onClick={downloadHtmlFile}>
          Download HTML
        </button>
      </div>
    </div>
  );
};

export default GrapesJSEditor;
