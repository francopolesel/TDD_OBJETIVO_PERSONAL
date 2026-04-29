export async function fetchPokemonList(limit: number, offset: number) {
    // Build the PokeAPI URL using the pagination params.
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

    // Call the API.
    const response = await fetch(url);

    // Fail fast when the request is not successful.
    if (!response.ok) {
        throw new Error("Failed to fetch pokemon list");
    }

    // Return the parsed JSON body.
    return response.json();
}