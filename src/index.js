const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://us-central1-escuelajs-api.cloudfunctions.net/characters';
let isTheEnd = false;

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

const renderEnd = () => {
  const p = document.getElementById('endElement');
  p.innerText = 'No hay mas elementos';
}

const intersectionObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    loadData();
  }
}, {
  rootMargin: '0px 0px 100% 0px',
});

const load = () => {
  localStorage.clear();
  intersectionObserver.observe($observe);
}

window.onload = load;
