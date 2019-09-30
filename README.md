# Escuelajs-reto-05
Reto 5 Septiembre 28: Curso de Fundamentos de JavaScript

# 100tifi.co

![100tifico](https://raw.githubusercontent.com/platzi/escuelajs-reto-05/master/screenshot.png?token=ACQQY5SNIXZ7QAVA5XIHPSC5TADSY)

Somos un directorio de personajes de la serie animada "Rick and Morty". Estamos por lanzar nuestra implementación y necesitamos resolver los problemas que presenta nuestra aplicación.

https://100tifi.co tiene un Bug, al llegar al final del listado de personajes se realiza una petición a la API ya que implementamos un "intersection observer" pero vuelve a obtener los mismos personajes y necesitamos cargar la lista completa de 468 personajes conforme hagamos scroll.

### Debug

Visita el sitio web: https://100tifi.co

### Instalación

```
npm install
```

### Ejecución

```
npm run start
```

### Documentación


- Variable llamada $app donde haremos render de nuestra app.
- Elemento del DOM que sera Observado.
- Constante 'API': Utilizamos la API de la escuela de Javascript para obtener los personajes de Rick and Morty
- Variable llamada 'isTheEnd' utilizada como un bandera para saber que llegamos al final de la imagenes, la cual tendra valores de true o false.


```javascript
const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://us-central1-escuelajs-api.cloudfunctions.net/characters';
let isTheEnd = false;
```

Función llamada 'getData' que se encarga de hacer Fetch a una API, almacenar en el local storage en una llave llamada 'next_fetch' la URL de la siguiente petición, en caso de que no exista una proxima invocación actualiza la bandera 'isTheEnd' con el valor de true y construye un elemento nuevo en el DOM.

```javascript
const getData = async api => {
  try {
    const fetchResponse = await fetch(api);
    const data = await fetchResponse.json();

    if (data.info.next) {
      localStorage.setItem('next_fetch', data.info.next);
    } else {
      isTheEnd = true;
    }

    const characters = data.results;
    let output = characters.map(character => {
      return `
          <article class="Card">
            <img src="${character.image}" />
            <h2>(${character.id}) ${character.name}<span>${character.species}</span></h2>
          </article>
        `
    }).join('');
    let newItem = document.createElement('section');
    newItem.classList.add('Items');
    newItem.innerHTML = output;
    $app.appendChild(newItem);
  } catch (error) {
    throw new Error(`Error consultando la información: ${error}`);
  }
}
```

Función loadData() encargada de hacer la petición de los personajes de acuerdo al valor almacenado en el local storage, en caso de no tener información en el local storage lo cual indica que es la primera petición realiza el llamado de la variable 'API' y valida si ya se llego al final de los personajes para llamar la función renderEnd().

```javascript
const loadData = () => {
    if (!isTheEnd) {
    let apiNextFetch = '';

    if (localStorage.getItem('next_fetch')) {
      apiNextFetch = localStorage.getItem('next_fetch');
    } else {
      apiNextFetch = API;
    }

    getData(apiNextFetch);
  } else {
    intersectionObserver.unobserve($observe);
    renderEnd();
  }
}
```
Función renderEnd() encargada de contruir y mostrar un mensaje en el DOM indicando que no hay mas elementos.

```javascript
const renderEnd = () => {
  const p = document.getElementById('endElement');
  p.innerText = 'No hay mas elementos';
}
```

Intersection Observer
```javascript

const intersectionObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    loadData();
  }
}, {
  rootMargin: '0px 0px 100% 0px',
});

intersectionObserver.observe($observe);
```

Función load() ejecutada cada vez que se recargue la página encargada de limpiar los datos almacenados en el local storage e inciar el patrón IntersectionObserver para observar nuestro elememtno target.

```javascript
const load = () => {
  localStorage.clear();
  intersectionObserver.observe($observe);
}
window.onload = load;
```


## RETO

### Primer problema

1. Guarda en localStorage la URL de la siguiente petición de personajes obtenida en la primera llamada a la API.
2. Utiliza el nombre para la llave: 'next_fetch'.
3. Comprueba que se ha guardado el valor 'next_fetch' en localStorage.

### Segundo Problema

1. Obten los datos almacenados en localStorage de la llave: 'next_fetch'.
2. Valida que exista un valor en 'next_fetch' o regresa el primer llamado de la API.
3. Actualiza la función loadData() a Async/Await.

### Tercer Problema

Cuando cerramos la pestaña o recargamos la pagina se debe de volver a mostrar los primeros 20 personajes.

1. Mostrar los primeros 20 personajes al recargar
2. Eliminar el localStorage.

### Cuarto Problema (Opcional)

La API utilizada "RickAndMortyApi.com" tiene 25 paginas de 20 personajes cada una, cuando la ultima petición sea ejecutada y el valor 'next' no sea entregado debes de mostrar un mensaje "Ya no hay personajes", a su vez debes de destruir el intersection observer.

1. Implementar mensaje: "Ya no hay personajes...".
2. Deja de observar el elemento "observe".

### Enviar solución de reto

Debes de crear un "Fork" de este proyecto, revolver los problemas y crear un Pull Request hacia este repositorio.

### Contribuir
Si alguien quiere agregar o mejorar algo, lo invito a colaborar directamente en este repositorio: [escuelajs-reto-05](https://github.com/platzi/escuelajs-reto-05/)

### Licencia
escuelajs-reto-05 se lanza bajo la licencia [MIT](https://opensource.org/licenses/MIT).
