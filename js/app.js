const d = document,
    $table = d.querySelector(".crud-table"),
    $form = d.querySelector(".crud-form"),
    $title = d.querySelector(".crud-title"),
    $template = d.getElementById("crud-template").content,
    $fragment = d.createDocumentFragment(),
    xhr = new XMLHttpRequest();

//FUNCION AJAX -> Servirá para las cuatro acciones (CREATE, READ , UPDATE & DELETE)
const ajax = options => {
    let {url, method , success , error, data} = options;

    //PETICION
    xhr.open(method || "GET", url);
    xhr.setRequestHeader("Content-type","application/json; charset=utf-8");
    xhr.send(JSON.stringify(data));
    
    //EVENTO DE LA PETICIÓN
    xhr.addEventListener("readystatechange", e => {
        if(xhr.readyState !== 4) return;

        if(xhr.status >= 200 && xhr.status < 300){
            let json = JSON.parse(xhr.responseText);
            success(json);
        } else {
            let mensaje = xhr.statusText || "Ocurrió un error";
            error(`Error ${xhr.status}: ${mensaje}`);
        }
    });
}

//Función para cargar en el DOM las personas una vez se recarga la página
const obtenerPersonas = () => {
    ajax({
        method: "GET",
        url:"http://localhost:5555/personas",
        success: (res) => {
            res.forEach(elem => {
                $template.querySelector(".nombre").textContent = elem.nombre;
                $template.querySelector(".cedula").textContent = elem.cedula;
                $template.querySelector(".edad").textContent = elem.edad;
                $template.querySelector(".genero").textContent = elem.genero;
                $template.querySelector(".estatura").textContent = elem.estatura;
                $template.querySelector(".estCivil").textContent = elem.estCivil;

                

                //PARA LOS BOTONES de editar y eliminar

                //Para el botón de editar -> Creamos un data-atributte en el botón por cada atributo  
                //de cada persona y le asignamos el valor que venga en dicha propiedad, así:
                let $botonEditar = $template.querySelector(".editar");
                $botonEditar.dataset.id = elem.id;
                $botonEditar.dataset.nombre = elem.nombre;
                $botonEditar.dataset.cedula = elem.cedula;
                $botonEditar.dataset.edad = elem.edad;
                $botonEditar.dataset.genero = elem.genero;
                $botonEditar.dataset.estatura = elem.estatura;
                $botonEditar.dataset.estCivil = elem.estCivil;

                //Para el botón de eliminar -> Sólo requerimos un data atributte con el id de la persona
                let $botonEliminar = $template.querySelector(".eliminar");
                $botonEliminar.dataset.id = elem.id;
            
                let $clone = d.importNode($template, true);
                $fragment.appendChild($clone);
            
            });
            $table.querySelector("tbody").appendChild($fragment);
        },
        error: (err) => {
            console.log(`Error: ${err}`);
            $table.insertAdjacentHTML("afterend",`<p><b>${err}</b></p>`);
        }
    });
}

//GET inicial -> Listener del evento DOMContentLoaded para cargar en pantalla 
//las personas cuando se recarga la página
d.addEventListener("DOMContentLoaded", obtenerPersonas);

d.addEventListener("submit",(e) =>{
    if(e.target === $form){
        e.preventDefault();     //Bloqueamos la acción por defecto del botón submit ya que lo haremos con AJAX
        
        if(!e.target.id.value){ //si el botón hidden no tiene valor en el id entra aquí
            //CREATE (POST)
            ajax({
                url: "http://localhost:5555/personas",
                method:"POST",
                success: (res) => location.reload(),
                error: (err) => $form.insertAdjacentHTML("afterend",`<p><b>${err}</b></p>`),
                data: {
                    nombre: e.target.nombre.value, //Así obtenemos los valores
                    cedula:e.target.cedula.value,  //de los campos de entrada
                    edad:e.target.edad.value,      //de un formulario.
                    genero:e.target.genero.value,
                    estatura:e.target.estatura.value,
                    estCivil:e.target.estCivil.value
                }
            });
        } else { 
            //UPDATE (PUT) 
            ajax({
                url: `http://localhost:5555/personas/${e.target.id.value}`,
                method:"PUT",
                success: (res) => location.reload(),
                error: (err) => $form.insertAdjacentHTML("afterend",`<p><b>${err}</b></p>`),
                data: {
                    nombre: e.target.nombre.value, //Así obtenemos los valores
                    cedula:e.target.cedula.value,  //de los campos de entrada
                    edad:e.target.edad.value,      //de un formulario.
                    genero:e.target.genero.value,
                    estatura:e.target.estatura.value,
                    estCivil:e.target.estCivil.value
                }
            });
        }
    }
});

d.addEventListener("click", e => {
    if(e.target.matches(".editar")){
        $form.id.value = e.target.dataset.id;
        $title.textContent = "Editar Persona";
        $form.nombre.value = e.target.dataset.nombre;
        $form.cedula.value = e.target.dataset.cedula;
        $form.edad.value = e.target.dataset.edad;
        $form.genero.value = e.target.dataset.genero;
        $form.estatura.value = e.target.dataset.estatura;
        $form.estCivil.value = e.target.dataset.estCivil;
    }
    if(e.target.matches(".eliminar")){
        let confirEliminacion = confirm(`Estás seguro de eliminar la persona con id ${e.target.dataset.id}?`);
        if(confirEliminacion){
            //DELETE
            ajax({
                url: `http://localhost:5555/personas/${e.target.dataset.id}`,
                method:"DELETE",
                success: (res) => location.reload(),
                error: (err) => $form.insertAdjacentHTML("afterend",`<p><b>${err}</b></p>`)
            });
        }
    }
});