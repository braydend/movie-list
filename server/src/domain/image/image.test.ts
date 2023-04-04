import { describe, expect, it } from "vitest";
import { getImages } from "./image";

describe("image domain", () => {
  it("returns a correctly constructed image map", async () => {
    const result = await getImages("/foo");

    expect(result).toEqual({
      backdrop: {
        large: "https://image.tmdb.org/t/p/w700/foo",
        medium: "https://image.tmdb.org/t/p/w500/foo",
        original: "https://image.tmdb.org/t/p/original/foo",
        small: "https://image.tmdb.org/t/p/w300/foo",
        xlarge: "https://image.tmdb.org/t/p/w1000/foo",
        xsmall: "https://image.tmdb.org/t/p/w100/foo",
      },
      logo: {
        large: "https://image.tmdb.org/t/p/w700/foo",
        medium: "https://image.tmdb.org/t/p/w500/foo",
        original: "https://image.tmdb.org/t/p/original/foo",
        small: "https://image.tmdb.org/t/p/w300/foo",
        xlarge: "https://image.tmdb.org/t/p/w1000/foo",
        xsmall: "https://image.tmdb.org/t/p/w100/foo",
      },
      poster: {
        large: "https://image.tmdb.org/t/p/w700/foo",
        medium: "https://image.tmdb.org/t/p/w500/foo",
        original: "https://image.tmdb.org/t/p/original/foo",
        small: "https://image.tmdb.org/t/p/w300/foo",
        xlarge: "https://image.tmdb.org/t/p/w1000/foo",
        xsmall: "https://image.tmdb.org/t/p/w100/foo",
      },
      profile: {
        large: "https://image.tmdb.org/t/p/w700/foo",
        medium: "https://image.tmdb.org/t/p/w500/foo",
        original: "https://image.tmdb.org/t/p/original/foo",
        small: "https://image.tmdb.org/t/p/w300/foo",
        xlarge: "https://image.tmdb.org/t/p/w1000/foo",
        xsmall: "https://image.tmdb.org/t/p/w100/foo",
      },
      still: {
        large: "https://image.tmdb.org/t/p/w700/foo",
        medium: "https://image.tmdb.org/t/p/w500/foo",
        original: "https://image.tmdb.org/t/p/original/foo",
        small: "https://image.tmdb.org/t/p/w300/foo",
        xlarge: "https://image.tmdb.org/t/p/w1000/foo",
        xsmall: "https://image.tmdb.org/t/p/w100/foo",
      },
    });
  });
});
