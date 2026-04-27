import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchPokemonList } from "./pokemonService";

describe("pokemonService", () => {
    beforeEach(() => {
        vi.stubGlobal("fetch", vi.fn());
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.unstubAllGlobals();
    });

    it("fetches the pokemon list from PokeAPI", async () => {
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

        const fetchMock = globalThis.fetch as unknown as ReturnType<typeof vi.fn>;

        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await fetchPokemonList(10, 0);

        expect(fetchMock).toHaveBeenCalledWith(
            "https://pokeapi.co/api/v2/pokemon?limit=10&offset=0"
        );
        expect(result).toEqual(mockResponse);
    });

    it("throws an error when the request fails", async () => {
        const fetchMock = globalThis.fetch as unknown as ReturnType<typeof vi.fn>;

        fetchMock.mockResolvedValueOnce({
            ok: false,
            status: 500,
        });

        await expect(fetchPokemonList(10, 0)).rejects.toThrow(
            "Failed to fetch pokemon list"
        );
    });
});