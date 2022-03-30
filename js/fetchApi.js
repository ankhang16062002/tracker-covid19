import fetchCovidApi from "./covidApi.js";

const baseUrl = "https://api.covid19api.com/";

export const getSumarry = async () => {
  return await fetchCovidApi(generatePath("summary"));
};

export const getCountryAllTimes = async (country) => {
  return await fetchCovidApi(generatePath(`total/dayone/country/${country}`));
};

export const getWorldAllTime = async () => {
  return await fetchCovidApi(generatePath("world"));
};

export const getLast30DaysCountry = async (country) => {
  let timeGap = genreateTime30Days(30);

  return await fetchCovidApi(
    generatePath(
      `country/${country}?from=${timeGap.date_from}&to=${timeGap.date_to}`
    )
  );
};

export const getLast30DaysWorld = async () => {
  let timeGap = genreateTime30Days(30);

  return await fetchCovidApi(
    generatePath(`world?from=${timeGap.date_from}&to=${timeGap.date_to}`)
  );
};

const genreateTime30Days = (days) => {
  const currDate = new Date();
  const last_30_dates = new Date(
    currDate.getTime() - days * 24 * 60 * 60 * 1000
  );

  const date_to = `${currDate.getFullYear()}-${
    currDate.getMonth() + 1
  }-${currDate.getDate()}`;

  const date_from = `${last_30_dates.getFullYear()}-${
    last_30_dates.getMonth() + 1
  }-${last_30_dates.getDate()}`;

  return {
    date_to,
    date_from,
  };
};

const generatePath = (endpoint) => baseUrl + endpoint;
