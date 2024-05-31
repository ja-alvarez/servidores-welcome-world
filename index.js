import express from 'express';
import fs from 'fs';
import moment from 'moment';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.listen(3000, () => {
    console.log("Servidor escuchando en el puerto 3000.")
});

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

app.get("/crear", (req, res) => {
    const { archivo, contenido } = req.query;
    const timestamp = moment().format('DDMMYYYY')
    const nombreArchivo = `${timestamp}_${archivo}`;
    fs.writeFile(nombreArchivo, contenido, () => {
        res.send("Archivo creado con éxito.")
    })
});

app.get("/leer", (req, res) => {
    const nombre = req.query.archivo
    fs.readFile(nombre, 'utf-8', (err, data) => {
        if (err) {
            res.send("Error al leer el archivo.");
        } else {
            res.send(data);
        }
    })
});

app.get("/renombrar", (req, res) => {
    const { nombre } = req.query
    const { nuevoNombre } = req.query
    if (nombre && nuevoNombre) {
        fs.rename(nombre, nuevoNombre, (err) => {
            if (err) {
                res.send("Error al renombrar el archivo o el archivo no existe.");
            } else {
                res.send(`${nombre} renombrado como: ${nuevoNombre}`);
            }
        });
    } else {
        res.send("Nombre de archivo no proporcionado.");
    }
});

app.get("/eliminar", (req, res) => {
    const { archivo } = req.query
    if (archivo) {
        try {
            fs.unlinkSync(archivo);
            res.send(`Archivo ${archivo} eliminado con éxito.`);
        } catch (error) {
            res.send("Error al eliminar el archivo o el archivo no existe.");
        }
    } else {
        res.send("Nombre de archivo no proporcionado.");
    }
});