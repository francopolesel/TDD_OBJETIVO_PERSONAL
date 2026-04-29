import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchPokemonList } from "./pokemonService";

describe("pokemonService", () => {
    // Runs before each test to replace the global fetch function with a mock.
    beforeEach(() => {
        vi.stubGlobal("fetch", vi.fn());
    });

    // Runs after each test to restore all mocks and clean the test environment.
    afterEach(() => {
        vi.resetAllMocks();
        vi.unstubAllGlobals();
    });

    it("fetches the pokemon list from PokeAPI", async () => {
        // Mock response that simulates what the PokeAPI returns.
        const mockResponse = {
            count: 1302,
            next: null,
            previous: null,
            results: [
                {
                    name: "bulbasaur",
                    url: "https://pokeapi.co/api/v2/pokemon/1/",
                },
            ],
        };

        // Get a typed reference to the mocked fetch function.
        const fetchMock = globalThis.fetch as unknown as ReturnType<typeof vi.fn>;

        // Make fetch resolve successfully with the mocked JSON response.
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        // Call the service with the pagination values.
        const result = await fetchPokemonList(10, 0);

        // Verify that fetch was called with the expected PokeAPI URL.
        expect(fetchMock).toHaveBeenCalledWith(
            "https://pokeapi.co/api/v2/pokemon?limit=10&offset=0"
        );

        // Verify that the service returns the data from the API response.
        expect(result).toEqual(mockResponse);
    });

    it("throws an error when the request fails", async () => {
        // Get a typed reference to the mocked fetch function.
        const fetchMock = globalThis.fetch as unknown as ReturnType<typeof vi.fn>;

        // Make fetch resolve with a failed HTTP response.
        fetchMock.mockResolvedValueOnce({
            ok: false,
            status: 500,
        });

        // Verify that the service throws the expected error when the request fails.
        await expect(fetchPokemonList(10, 0)).rejects.toThrow(
            "Failed to fetch pokemon list"
        );
    });
});