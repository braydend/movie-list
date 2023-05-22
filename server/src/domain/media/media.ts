import {
  type TmdbConfigurationResponse,
  type TmdbMovieDetails,
  type TmdbSearchMovieResult,
  type TmdbSearchShowResult,
  type TmdbShowDetails,
} from "../../api";
import { getImages, type Images } from "../image";
import { type WatchProvider } from "../watchProviders";

// TODO: remove this and replace with common typing
export interface Media {
  id: number;
  title: string;
  images: Images;
  __type: "movie" | "show";
  genres: string[];
  isWatched?: boolean;
  watchProviders?: WatchProvider[];
}

export type MediaList = Media[];

export const mapSearchResponseToMedia = (
  response: TmdbSearchShowResult | TmdbSearchMovieResult,
  configuration: TmdbConfigurationResponse,
  watchProviders?: WatchProvider[]
): Media => {
  const isMovie = response.__type === "movie";
  const images = getImages(response.poster_path, configuration);

  return {
    id: response.id,
    title: isMovie ? response.title : response.name,
    images,
    __type: response.__type,
    genres: [],
    watchProviders,
  };
};

export const mapMediaDetailsToMedia = (
  response: TmdbMovieDetails | TmdbShowDetails,
  configuration: TmdbConfigurationResponse,
  watchProviders?: WatchProvider[]
): Media => {
  const isMovie = response.__type === "movie";
  const images = getImages(response.poster_path, configuration);

  return {
    id: response.id,
    title: isMovie ? response.title : response.name,
    images,
    __type: response.__type,
    genres: response.genres.map(({ name }) => name),
    watchProviders,
  };
};

export const mapMediaDetailsToMediaList = (
  response: TmdbMovieDetails[] | TmdbShowDetails[],
  configuration: TmdbConfigurationResponse
): MediaList => {
  return response.map((res) => mapMediaDetailsToMedia(res, configuration));
};

export const mapSearchResponseToMediaList = (
  response: TmdbSearchMovieResult[] | TmdbSearchShowResult[],
  configuration: TmdbConfigurationResponse
): MediaList => {
  return response.map((res) => mapSearchResponseToMedia(res, configuration));
};
