const fetchCovidApi = async (url) => {
  return await fetch(url).then((res) => res.json());
};

export default fetchCovidApi;
