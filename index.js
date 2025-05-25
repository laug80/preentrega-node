import fs from 'fs'
import fetch from 'node-fetch';
import { json } from 'stream/consumers';

 
const ingestadatos= ('https://fakestoreapi.com/products')

//Get all Productos
function obtenerdatos(){
   fetch(ingestadatos)
    .then(response =>{
     if (response.ok){
    return response.json()  
     }
     else {
           console.log("No pudieron obtenerse los datos", response.status)
     } 

     return null
  }  )
     .then (data=> {
        console.log(data)
     }
    )
}

//Get Productos by id se utiliza async y await para identificar cuando el error es porque el id no existe.

async function getproductbyid(id){

    try{
        const response = await fetch(`${ingestadatos}/${id}`);
        if (!response.ok){
             console.log(`Error: ${response.status}`)
             return;
        }
        const text = await response.text(); //response.text nos devuelve el contenido como strinng y evitamos errores de JSON vacío

        if(!text){
             console.log(` El id ${id} no existe`);
      return;
        }
        const data =JSON.parse(text);
        if (!data || Object.keys(data).length===0){
            console.log(`No existe el id {id}`);
        }
   
        else  {
           console.log(data, response.status);
          
        }
    } catch (error) {
    console.error(" Error al obtener el producto:", error);
  }
}

//Crear producto

    function crearproducto(title, price, description, category, image){

        const configuracion= {
        method:"Post",
        headers:{
            "Content-Type":"application/json"   
        },
        body:JSON.stringify({

            "title":title,
            "price":parseFloat(price),
            "description": description,
            "category":category,
            "image":image
        })
    }
     fetch(ingestadatos,configuracion)
       .then (response =>{
        if(response.ok){
          return response.json()
    }  
         else {
           console.log("No pudieron cargar los datos", response.status)
         return null
       
       }
    })
       .then (data=> {
        if(data){
        console.log(data)
     }
    })
}
   // EliminarProducto
   
   async function eliminarproducto(id){

    try {
        const response=await fetch(`${ingestadatos}/${id}`,{
     method:"DELETE"
   })
    if (!response.ok){
        console.log(`Error:${response.status}`)
        return;
    }
    const text = await response.text();
    if(!text){
        console.log(`No existe el id:${id}`);
        return;
    }
    const data = JSON.parse(text);
    if(!data || Object.keys(data).length===0){
        console.log(`No existe el id {id}`);
    }
    else{
        console.log(response.status,data,"fue elimiado con éxito");
       }

    }  
       catch(error){
        console.log(`El id ${id} es inexistente`);
       }
    
}
//imprimimos los argumentos ingresados 
    const argumentos = process.argv.slice(2)
    const accion =argumentos[0]
    console.log("Acción ingresada:", accion);
    console.log("Argumentos:", argumentos);

switch (accion){
    case'get':
    obtenerdatos();

         break;

    case 'getbyid':{
        const id = argumentos[1]
        getproductbyid(id);

        break;
    }  
    //Uso de spread para pasar los argumentos necesarios para crear el producto
        case  'post':{
                const [, ...datos] = argumentos
                const [title,price,description,category,image]= datos
                const producto = {
                        title,
                        price: parseFloat(price), //convertir lo ingresado a número
                        description,
                        category,
                        image
                    };
                       crearproducto(producto);              
                break;   
        }
          
   case  'delete':{
    const id=argumentos[1]
        eliminarproducto(id);

        break;     
   }
     default:
    console.log("Acción no permitida, solo se puede llamar a: get, getbyid <id>, post, delete <id>");


}