import {
  getWatchProviderRegions as getWatchProviderRegionsQuery,
  type TmdbConfigurationResponse,
  type TmdbShowWatchProviderResponse,
  type TmdbWatchProviderRegionsResponse,
  type WatchProviderDetails,
  getShowWatchProviders as fetchShowWatchProviders,
} from "../../api";
import { addToCache, retrieveFromCache } from "../../db/mongodb/cache";
import { logger } from "../../libs/logger";
import { getImages } from "../image";

export interface WatchProviderRegion {
  countryId: string;
  name: string;
}

export interface PricedWatchProviders {
  name: string;
  logoUrl: string;
}

type PricingOption = "flatrate" | "buy" | "ads" | "rent" | "free";

export type WatchProvider = {
  [pricingOption in PricingOption]?: PricedWatchProviders[];
} & {
  region: string;
};

const CACHE_KEY = "watchProviderRegions";

const buildPricedWatchProvider = (
  details: WatchProviderDetails[],
  configuration: TmdbConfigurationResponse
): PricedWatchProviders[] => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  return details.map(({ provider_name, logo_path }) => ({
    name: provider_name,
    logoUrl: getImages(logo_path, configuration).logo.original ?? "",
  }));
};

const filterWatchProvidersByRegion = (
  region: string,
  providers: WatchProvider[]
) => {
  return providers.filter(
    ({ region: providerRegion }) => region === providerRegion
  );
};

export const mapResponseToWatchProvider = (
  response: TmdbShowWatchProviderResponse,
  configuration: TmdbConfigurationResponse,
  region?: string
): WatchProvider[] => {
  const providers = Object.entries(response.results);

  const mappedProviders = providers.map(([region, providerData]) => {
    return {
      region,
      free:
        providerData.free != null
          ? buildPricedWatchProvider(providerData.free, configuration)
          : undefined,
      buy:
        providerData.buy != null
          ? buildPricedWatchProvider(providerData.buy, configuration)
          : undefined,
      ads:
        providerData.ads != null
          ? buildPricedWatchProvider(providerData.ads, configuration)
          : undefined,
      flatrate:
        providerData.flatrate != null
          ? buildPricedWatchProvider(providerData.flatrate, configuration)
          : undefined,
      rent:
        providerData.rent != null
          ? buildPricedWatchProvider(providerData.rent, configuration)
          : undefined,
    };
  });

  return region != null
    ? filterWatchProvidersByRegion(region, mappedProviders)
    : mappedProviders;
};

const mapResponseToRegion = (
  response: TmdbWatchProviderRegionsResponse
): WatchProviderRegion[] => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  return response.results.map(({ iso_3166_1, native_name }) => ({
    name: native_name,
    countryId: iso_3166_1,
  }));
};

export const getWatchProviderRegions = async (): Promise<
  WatchProviderRegion[]
> => {
  logger.profile("getWatchProviderRegions");
  const cachedProviders =
    await retrieveFromCache<TmdbWatchProviderRegionsResponse>(CACHE_KEY);

  if (cachedProviders != null) {
    return mapResponseToRegion(cachedProviders.data);
  }

  const response = await getWatchProviderRegionsQuery();

  addToCache(CACHE_KEY, response);

  const mappedRegions = mapResponseToRegion(response);
  logger.profile("getWatchProviderRegions");

  return mappedRegions;
};

export const getShowWatchProviders = async (
  id: string,
  configuration: TmdbConfigurationResponse,
  region?: string
): Promise<WatchProvider[]> => {
  logger.profile("getShowWatchProviders");
  const cachedWatchProviders =
    await retrieveFromCache<TmdbShowWatchProviderResponse>(id, {
      "data.__type": "showWatchProviders",
    });

  if (cachedWatchProviders != null) {
    return mapResponseToWatchProvider(
      cachedWatchProviders.data,
      configuration,
      region
    );
  }

  const result = await fetchShowWatchProviders(id);

  addToCache(id, { ...result, __type: "showWatchProviders" });

  logger.profile("getShowWatchProviders");

  return mapResponseToWatchProvider(result, configuration, region);
};
