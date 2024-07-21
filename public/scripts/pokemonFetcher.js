document.addEventListener('DOMContentLoaded', () => {
  const pokemonImage = document.querySelector('.pokemon__image');
  
  const handleSearch = (context, search) => {
    if (!search) {
      alert('Por favor introduzca un valor');
      return;
    }
    const spinner = document.getElementById('spinner');
    spinner.style.display = 'block';
    setTimeout(() => {
      spinner.style.display = 'none';
    }, 5000);
    let url;
    if (context === 'name' || context === 'id') {
      url = `https://pokeapi.co/api/v2/pokemon/${search}`;
    } else if (context === 'type') {
      url = `https://pokeapi.co/api/v2/type/${search}`;
    } else if (context === 'ability') {
      url = `https://pokeapi.co/api/v2/ability/${search}`;
    }

    if (url) {
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('No se encontraron resultados');
          }
          return response.json();
        })
        .then(data => {
          setTimeout(() => {
            spinner.style.display = 'none';
          }, 1000);
          if (context === 'name' || context === 'id') {
            displayPokemon(data);
          } else if (context === 'type' || context === 'ability') {
            displayPokemonList(data.pokemon, context);
          }
        })
        .catch(error => {
          showError(error.message);
          setTimeout(() => {
            spinner.style.display = 'none';
          }, 5000);
        });
    } else {
      showError('Contexto de búsqueda no válido');
      setTimeout(() => {
        spinner.style.display = 'none';
      }, 5000);
    }
  };

  const fetchRandomPokemon = () => {
    const randomId = Math.floor(Math.random() * 898) + 1;
    fetchPokemon(randomId);
  };

  const fetchPokemon = (search) => {
    handleSearch('id', search);
  };

  const displayPokemon = (data) => {
    const pokemon = document.getElementById('pokemon__data');
    pokemon.innerHTML = `
      <img class="pokemon__image" src="${data.sprites.front_default}" alt="${data.name}">
      <section class="pokemon-datas">
        <h2 class="pokemon__name">${data.name}</h2>
        <p>Experiencia base: ${data.base_experience}</p>
        <p>Altura: ${data.height}</p>
        <p>Orden: ${data.order}</p>
        <p>Peso: ${data.weight}</p>
        <p>Habilidad: <br>${data.abilities.map(a => a.ability.name).join('<br> ')}</p>
      </section>
    `;
  };

  const displayPokemonList = (pokemonList, context) => {
    const pokemon = document.getElementById('pokemon__container');
    pokemon.innerHTML = `<h2>Pokemones con ${context}</h2>`;
    pokemonList.forEach(p => {
      fetch(p.pokemon.url)
        .then(response => response.json())
        .then(data => {
          pokemon.innerHTML += `
            <div class="container">
              <h3>${data.name}</h3>
              <img src="${data.sprites.front_default}" alt="${data.name}">
            </div>
          `;
        });
    });
  };

  const clearResults = () => {
    document.getElementById('pokemon__data').innerHTML = '';
    document.getElementById('pokemon__container').innerHTML = '';
    document.getElementById('search').value = '';
  };

  const showError = (message) => {
    const pokemon = document.getElementById('pokemon__data');
    pokemon.innerHTML = `<p style="color: red;">${message}</p>`;
  };

  // Add event listeners for the buttons
  document.querySelectorAll('.buttons button').forEach(button => {
    button.addEventListener('click', (event) => {
      const context = event.target.getAttribute('data-context');
      const search = document.getElementById('search').value.toLowerCase();

      if (context) {
        handleSearch(context, search);
      } else if (event.target.id === 'clear-button') {
        clearResults();
      } else if (event.target.id === 'random-button') {
        fetchRandomPokemon();
      } else if (event.target.id === 'redirectButton') {
        window.location.href = 'filters.html';
      }
    });
  });
});
