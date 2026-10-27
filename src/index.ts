import express from 'express';
import type {Request, Response, NextFunction} from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

interface Producto {
    id: number;
    nombre: string;
    precio: number;
    stock: number;
    activo: boolean;
};

let productos: Producto[] = [
    {id: 1, nombre:"Laptop", precio: 1200, stock: 5, activo: true},
    {id: 2, nombre:"Mouse", precio: 25, stock: 50, activo: true},
    {id: 3, nombre:"Keyboard", precio: 50, stock: 20, activo: false},
];

export const validarProducto = (req: Request, res: Response, next:NextFunction): void => {
    const {nombre, precio, stock} = req.body;

if(!nombre || typeof nombre !== 'string' || nombre.trim() === ''){
    res.status(400).json({
      ok: false,
      mensaje: `Error: El nombre es obligatorio y debe ser texto.`
    });
    return;
}
if (typeof precio !== 'number' || precio <= 0 ){
    res.status(400).json({
        ok: false,
        mensaje: `Error: El precio debe ser un número mayor a 0.`
    });
    return;
}
if(typeof stock !== 'number'||stock <= 0){
    res.status(400).json({
        ok: false,
        mensaje: `Error: El stock debe ser un número entero mayor a 0.`,
    })
    return;
}
};

export const verificarRol = (rolMinimo: 'MODERADOR'|'ADMIN') =>(req:Request, res:Response, next:NextFunction): void => {
    const rol = req.headers['x-rol'];
    if(!rol || rolMinimo === 'ADMIN' && rol !== 'ADMIN') {
        res.status(403).json({
            ok: false,
            mensaje: `Error: Acceso denegado. Se requiere rol ADMIN.`
        });
        return;
    }
    next();
};

//APIs
app.get('/api/productos', (req:Request, res:Response) => {
    res.status(200).json({
        ok: true,
        mensaje: `Lista de todos nuestros productos disponibles.`,
        data: productos.filter((p) => p.activo)
    });
});

app.get('/api/productos/:id', (req: Request, res: Response) =>{
    const id = Number(req.params.id);
    const product = productos.find(p => p.id === id);
  if (!product) {
    res.status(404).json({ error: 'Producto no encontrado' });
    return;
  }
  res.json(product);
});

//Para priorizar el entregable, esto no lo pude terminar, aceptaré cualquier feedback, gracias!!
// app.put('/api/productos/:id', validarProducto, (req: Request, res: Response) => {
//   const id = Number(req.params.id);
//   const index = productos.findIndex(p => p.id === id);
//   if (index === -1) {
//     res.status(404).json({ error: 'Producto no encontrado para actualizar' });
//     return;
//   }
//   const { nombre, precio, stock } = req.body;
//   productos[]


