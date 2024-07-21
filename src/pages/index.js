import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import { fetchPokemons, fetchPokemonByNameOrId, fetchPokemonByType, fetchPokemonByAbility } from '../services/api';

export default function Home() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [allPokemons, setAllPokemons] = useState([]);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(50);

  useEffect(() => {
    const fetchPokemonsData = async () => {
      try {
        const data = await fetchPokemons(limit, offset);
        setPokemons(prevPokemons => [...prevPokemons, ...data.results]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pokemons:', error);
        setLoading(false);
      }
    };

    fetchPokemonsData();
  }, [offset, limit]);

  const handleSearch = async (context) => {
    if (!searchTerm) {
      alert('Por favor introduzca un valor');
      return;
    }

    if (context === 'ability') {
      clearResults();
    }

    const spinner = document.getElementById('spinner');
    spinner.style.display = 'block';
    setError(''); // Limpiar el error antes de la búsqueda

    try {
      let data;
      if (context === 'name' || context === 'id') {
        data = await fetchPokemonByNameOrId(searchTerm);
        clearResults();
        if (!data) throw new Error('Pokémon no encontrado');
        displayPokemon(data);
      } else if (context === 'type') {
        clearResults();
        data = await fetchPokemonByType(searchTerm);
        if (!data.pokemon.length) throw new Error('No se encontraron Pokémon con ese tipo');
        displayPokemonList(data.pokemon, context);
      } else if (context === 'ability') {
        clearResults();
        data = await fetchPokemonByAbility(searchTerm);
        if (!data.pokemon.length) throw new Error('No se encontraron Pokémon con esa habilidad');
        displayPokemonList(data.pokemon, context);
      } else {
        throw new Error('Contexto de búsqueda no válido');
      }
    } catch (error) {
      setError(error.message);
      setPokemons([]);
      document.getElementById('pokemon__data').innerHTML = '';
      document.getElementById('pokemon__container').innerHTML = '';
    } finally {
      spinner.style.display = 'none';
    }
  };

  const displayPokemon = (data) => {
    const pokemon = document.getElementById('pokemon__data');
    const heightInMeters = (data.height / 10).toFixed(1); // Dividir por 10 y redondear a 1 decimal
    const weightInKg = (data.weight / 10).toFixed(1); // Dividir por 10 y redondear a 1 decimal

    pokemon.innerHTML = `
      <div class="${styles.pokemonCard}">
        <img class="${styles.pokemonImage}" src="${data.sprites.front_default}" alt="${data.name}">
        <div class="${styles.pokemonDetails}">
          <h2 class="${styles.pokemonName}">${data.name}</h2>
          <p><strong>Experiencia base:</strong> ${data.base_experience}</p>
          <p><strong>Altura:</strong> ${heightInMeters} m</p>
          <p><strong>Orden:</strong> ${data.order}</p>
          <p><strong>Peso:</strong> ${weightInKg} kg</p>
          <p><strong>Habilidad:</strong><br>${data.abilities.map(a => a.ability.name).join('<br> ')}</p>
        </div>
      </div>
    `;
  };

  const displayPokemonList = (pokemonList, context) => {
    const pokemonContainer = document.getElementById('pokemon__container');
    
    
    pokemonList.forEach(p => {
      fetch(p.pokemon.url)
        .then(response => response.json())
        .then(data => {
          const heightInMeters = (data.height / 10).toFixed(1); // Convertir a metros
          const weightInKg = (data.weight / 10).toFixed(1); // Convertir a kg
          
          pokemonContainer.innerHTML += `
            <div class="${styles.pokemonCard}">
              <img src="${data.sprites.front_default}" alt="${data.name}" class="${styles.pokemonImage}">
              <div class="${styles.pokemonDetails}">
                <h3>${data.name}</h3>
                <p><strong>Experiencia base:</strong> ${data.base_experience}</p>
                <p><strong>Altura:</strong> ${heightInMeters} m</p>
                <p><strong>Peso:</strong> ${weightInKg} kg</p>
                <p><strong>Habilidades:</strong> ${data.abilities.map(a => a.ability.name).join(', ')}</p>
              </div>
            </div>
          `;
        });
    });
  };

  const clearResults = () => {
    document.getElementById('pokemon__data').innerHTML = '';
    document.getElementById('pokemon__container').innerHTML = '';
    setPokemons([]);
    setAllPokemons([]);
    setSearchTerm('');
  };

  const fetchRandomPokemon = () => {
    const randomId = Math.floor(Math.random() * 898) + 1;
    handleSearch('id', randomId);
  };

  const fetchAllPokemons = async () => {
    try {
      let allPokemonsData = [];
      let offset = 0;
      const limit = 800;
      let morePokemons = true;

      while (morePokemons) {
        const data = await fetchPokemons(limit, offset);
        allPokemonsData = [...allPokemonsData, ...data.results];
        offset += limit;

        if (data.results.length < limit) {
          morePokemons = false;
        }
      }

      setAllPokemons(allPokemonsData);
      printAllPokemons(allPokemonsData);
    } catch (error) {
      console.error('Error fetching all pokemons:', error);
    }
  };

  const printAllPokemons = (pokemons) => {
    const container = document.getElementById('pokemon__container');
    clearResults();
    container.innerHTML = '<h2>Todos los Pokémon</h2>';
    pokemons.forEach(pokemon => {
      fetch(pokemon.url)
        .then(response => response.json())
        .then(data => {
          container.innerHTML += `
            <div class="${styles.pokemonCard}">
              <img src="${data.sprites.front_default}" alt="${data.name}" class="${styles.pokemonImage}">
              <div class="${styles.pokemonDetails}">
                <h3>${data.name}</h3>
                <p><strong>Experiencia base:</strong> ${data.base_experience}</p>
                <p><strong>Altura:</strong> ${(data.height / 10).toFixed(1)} m</p>
                <p><strong>Peso:</strong> ${(data.weight / 10).toFixed(1)} kg</p>
                <p><strong>Habilidades:</strong> ${data.abilities.map(a => a.ability.name).join(', ')}</p>
              </div>
            </div>
          `;
        });
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>Pokedex</div>
        <nav className={styles.navLinks}>
          <a className={styles.navLink} href="#" onClick={clearResults}>Limpiar</a>
          <a className={styles.navLink} href="#" onClick={() => handleSearch('id')}>Buscar por ID</a>
          <a className={styles.navLink} href="#" onClick={() => handleSearch('name')}>Buscar por Nombre</a>
          <a className={styles.navLink} href="#" onClick={() => handleSearch('ability')}>Buscar por Habilidad</a>
          <a className={styles.navLink} href="#" onClick={fetchAllPokemons}>Mostrar Todos</a>
        </nav>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Buscar pokemon"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className={styles.headerButton}
          onClick={() => handleSearch('id', searchTerm)}
        >
          Buscar
        </button>
      </header>
      
      <div id="pokemon__data" className={styles.pokemonData}>
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
      <div id="pokemon__container" className={styles.grid}></div>
      
      <div id="spinner" style={{ display: 'none' }}>Cargando...</div>
    </div>
  );
}
