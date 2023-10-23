import "./App.css";
import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";

function App() {
  const [files, setFiles] = useState([]);
  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const formData = new FormData();
      formData.append("file", file);
      fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            console.log("Archivo subido con éxito.");
            // Puedes realizar cualquier otra acción necesaria después de la carga exitosa
          } else {
            console.error("Error al subir el archivo.");
          }
        })
        .catch((error) => {
          console.error("Error de red:", error);
        });
    });
  };
  const downloadFile = (file) => {
    const downloadUrl = `http://localhost:8000/download?filename=${file}`;
    fetch(downloadUrl)
      .then((response) => {
        if (response.ok) {
          // Si la respuesta es exitosa, obtenemos el blob y creamos un enlace de descarga
          return response.blob();
        } else {
          throw new Error("Error al descargar el archivo");
        }
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error de descarga:", error);
      });
  };
  useEffect(() => {
    fetch("http://localhost:8000/list")
      .then((response) => response.json())
      .then((data) => {
        setFiles(data);
      })
      .catch((error) => console.error(error));
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return (
    <div className="App">
      <div>
        <h2>Lista de archivos</h2>
        <ul>
          {files.map((file, index) => (
            <li key={index}>
              {file}
              <button onClick={() => downloadFile(file)}>Descargar</button>
            </li>
          ))}
        </ul>

        <h2>Subir un nuevo archivo</h2>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <p>
            Arrastra y suelta archivos aquí o haz clic para seleccionar
            archivos.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
