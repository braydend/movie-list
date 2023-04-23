import {
  getShow as fetchShow,
  getShowWatchProviders,
  searchShows as searchShowRequest,
  type TmdbShow,
} from "../api/tmdb";
import { addToCache, retrieveFromCache } from "../db/mongodb/cache";
import { logger } from "../libs/logger";
import {
  mapApiResponseToMediaList,
  mapApiResponseToMediaWithWatchProviders,
  type Media,
  type MediaList,
} from "./media";
import { getConfiguration } from "./configuration";

export const getShow = async (id: string): Promise<Media> => {
  logger.profile(`getShow #${id}`);
  const cachedShow = await retrieveFromCache<TmdbShow>(id, {
    "data.__type": "show",
  });
  const configuration = await getConfiguration();
  const watchProviders = await getShowWatchProviders(id);

  if (cachedShow != null) {
    return mapApiResponseToMediaWithWatchProviders(
      cachedShow.data,
      configuration,
      watchProviders
    );
  }

  const show = await fetchShow(id);
  addToCache(id, show);

  const mappedMedia = mapApiResponseToMediaWithWatchProviders(
    show,
    configuration,
    watchProviders
  );

  logger.profile(`getShow #${id}`);

  return mappedMedia;
};

export const searchShows = async (query: string): Promise<MediaList> => {
  logger.profile(`searchShows: ${query}`);
  const { results } = await searchShowRequest(query);
  const configuration = await getConfiguration();

  for (const show of results) {
    // Don't await caching of data returned from API
    addToCache(show.id.toString(10), show);
  }

  const mappedMedia = mapApiResponseToMediaList(results, configuration);
  logger.profile(`searchShows: ${query}`);

  return mappedMedia;
};
