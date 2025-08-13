import express from 'express';
import fs from 'fs';
import bodyParser from "body-parser";
import cors from 'cors'

const port = 3001;
const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:5173"
}))

const leerData =() =>{
    try{
        const data = fs.readFileSync('./data.json');
        return JSON.parse(data)
    }catch(err){
        console.log(err)
    }
};

const escribirData = (data) =>{
    try{
        fs.writeFileSync('./data.json', JSON.stringify(data))
    }catch(err){
        console.log(err)
    }
};


app.get('/libros',(req, res) =>{
    const data = leerData();
    res.json(data.libros)
})

app.get('/libros/:id', (req, res) =>{
    const data = leerData();
    const id = parseInt(req.params.id); // Con esto recupero el paramatro ID
    const libro = data.libros.find((libro) => libro.id === id);
    res.json(libro)
});

app.post('/libros', (req, res) => {
    const data = leerData();
    const body = req.body;
    const newLibro = {
        id: data.libros.length + 1,
        ...body,
    }

    data.libros.push(newLibro)
    escribirData(data);

    res.json(newLibro)
});


app.put("/libros/:id", (req, res) =>{
    const data = leerData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const libroIndex = data.libros.findIndex((libro) => libro.id === id);
    data.libros[libroIndex] = {
        ...data.libros[libroIndex],
        ...body,
    }
    escribirData(data);

    res.json({message: "Libro Actualizado Correctamente"})
})

app.delete('/libros/:id', (req, res) =>{
    const data = leerData();
    const id = parseInt(req.params.id);
    const libroIndex = data.libros.findIndex((libro) => libro.id === id);
    data.libros.splice(libroIndex, 1);
    escribirData(data);
    res.json({message: "Libro Elimnado con exito"})
})

app.listen(port, () =>{
    console.log(`Servidor escuchado en puerto: ${port}`);
});
