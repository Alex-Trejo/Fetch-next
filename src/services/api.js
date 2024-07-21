// Función para realizar una petición a la API y manejar errores
export const fetchPokemonData = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('No se encontraron resultados');
      }
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
};

// Función para obtener una lista de Pokémon con paginación
export const fetchPokemons = async (limit = 900, offset = 0) => {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    return await fetchPokemonData(url);
};

// Función para buscar Pokémon por nombre o ID
export const fetchPokemonByNameOrId = async (search) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${search}`;
    return await fetchPokemonData(url);
};

// Función para buscar Pokémon por tipo
export const fetchPokemonByType = async (search) => {
    const url = `https://pokeapi.co/api/v2/type/${search}`;
    return await fetchPokemonData(url);
};

// Función para buscar Pokémon por habilidad
export const fetchPokemonByAbility = async (search) => {
    const url = `https://pokeapi.co/api/v2/ability/${search}`;
    return await fetchPokemonData(url);
};
