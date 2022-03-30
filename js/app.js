"use strict";

import {
  getSumarry,
  getCountryAllTimes,
  getWorldAllTime,
  getLast30DaysCountry,
  getLast30DaysWorld,
} from "./fetchApi.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const loader = $(".loader");

let allTimesChart;
let lastDaysChart;
let deathRateChart;

window.onload = () => {
  initialIframe();
  initialAllTimesChart();
  initialDeathRateChart();
  initialLastDaysChart();
  initialDarkMode();

  startLoading();
  //render data default
  renderDataDefault("world");
  endLoading();
};

const renderDataDefault = async (type) => {
  //get data summary
  await renderDataSummary(type);
  //getChart
  await getAllTimesChart(type);
  await getLastDayChart(type);
};

const renderDataSummary = async (type) => {
  let confirmedStatusNumber = $(".status-total.confirmed span");
  let recoveredStatusNumber = $(".status-total.recovered span");
  let deathsStatusNumber = $(".status-total.deaths span");
  let topCountries = $(".top-affected-table tbody");

  let numConfirmed;
  let numRecovered;
  let numDeaths;

  const dataSummary = await getDataSummary();

  const dataShow =
    type === "world"
      ? dataSummary.Global
      : dataSummary.Countries.filter((item) => type === item.Slug)[0];

  numConfirmed = dataShow.TotalConfirmed;
  numRecovered = dataShow.TotalRecovered;
  numDeaths = dataShow.TotalDeaths;
  //render status to screen
  confirmedStatusNumber.textContent = numberWithComas(numConfirmed);
  recoveredStatusNumber.textContent = numberWithComas(numRecovered);
  deathsStatusNumber.textContent = numberWithComas(numDeaths);

  //sort ten top rate countries
  dataSummary.Countries.sort((a, b) => b.TotalConfirmed - a.TotalConfirmed);
  //render top rate countrise to screen
  topCountries.innerHTML = dataSummary.Countries.slice(0, 10)
    .map(
      (country) => `
     <tr>
        <td>${country.Country}</td>
        <td>${country.TotalConfirmed}</td>
        <td>${country.TotalRecovered}</td>
        <td>${country.TotalDeaths}</td>
      </tr>
  `
    )
    .join("");
  //render death rate to screen
  deathRateChart.updateOptions({
    series: [Math.ceil((numDeaths / numConfirmed) * 100)],
  });

  //render list country
  getListCountry(dataSummary.Countries);
};

const getAllTimesChart = async (type) => {
  let categories = [];
  let conformeds = [];
  let recovereds = [];
  let deaths = [];

  let dataShow =
    type === "world" ? await getWorldAllTime() : await getCountryAllTimes(type);

  dataShow.sort((a, b) => new Date(a.Date) - new Date(b.Date));

  if (type === "world") {
    for (var i = 0; i < dataShow.length; i++) {
      categories.push(customDate(dataShow[i].Date));
      conformeds.push(dataShow[i].TotalConfirmed);
      recovereds.push(dataShow[i].TotalRecovered);
      deaths.push(dataShow[i].TotalDeaths);
    }
  } else {
    for (var i = 0; i < dataShow.length; i++) {
      categories.push(customDate(dataShow[i].Date));
      conformeds.push(dataShow[i].Confirmed);
      recovereds.push(dataShow[i].Recovered);
      deaths.push(dataShow[i].Deaths);
    }
  }

  //update allTimesChart
  allTimesChart.updateOptions({
    series: [
      {
        name: "Confirmed",
        data: conformeds,
      },
      {
        name: "Recovered",
        data: recovereds,
      },
      {
        name: "Deaths",
        data: deaths,
      },
    ],
    xaxis: {
      categories,
      labels: {
        show: false,
      },
    },
  });
};

const getLastDayChart = async (type) => {
  let categories = [];
  let conformeds = [];
  let recovereds = [];
  let deaths = [];
  let dataShow =
    type === "world"
      ? await getLast30DaysWorld()
      : await getLast30DaysCountry(type);

  dataShow.sort((a, b) => new Date(a.Date) - new Date(b.Date));

  if (type === "world") {
    for (var i = 0; i < dataShow.length; i++) {
      categories.push(customDate(dataShow[i].Date));
      conformeds.push(dataShow[i].TotalConfirmed);
      recovereds.push(dataShow[i].TotalRecovered);
      deaths.push(dataShow[i].TotalDeaths);
    }
  } else {
    for (var i = 0; i < dataShow.length; i++) {
      categories.push(customDate(dataShow[i].Date));
      conformeds.push(dataShow[i].Confirmed);
      recovereds.push(dataShow[i].Recovered);
      deaths.push(dataShow[i].Deaths);
    }
  }

  //update lastDaysChart
  lastDaysChart.updateOptions({
    series: [
      {
        name: "Confirmed",
        data: conformeds,
      },
      {
        name: "Recovered",
        data: recovereds,
      },
      {
        name: "Deaths",
        data: deaths,
      },
    ],
    xaxis: {
      categories,
      labels: {
        show: false,
      },
    },
  });
};

const getDataSummary = async () => {
  return await getSumarry();
};

const initialIframe = () => {
  let iframes = $$(".content-left-video iframe");
  iframes.forEach((iframe) => {
    iframe.style.height = `${(iframe.offsetWidth * 9) / 16}px`;
  });
};

const initialAllTimesChart = () => {
  const options = {
    chart: {
      type: "line",
      width: "100%",
    },
    colors: ["#d00000", "#76b041", "#081c15"],
    series: [],
    grid: {
      show: false,
    },
    xaxis: {
      categories: [],
      labels: {
        show: false,
      },
    },
    legend: {
      show: true,
      horizontalAlign: "center",
      offsetX: 40,
    },
    stroke: {
      curve: "smooth",
    },
    theme: {
      mode: "light",
    },
  };

  allTimesChart = new ApexCharts($(".all-times-chart"), options);
  allTimesChart.render();
};

const initialDeathRateChart = () => {
  const options = {
    chart: {
      type: "radialBar",
    },
    colors: ["#03071e"],
    series: [],
    labels: ["Death Rate"],
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            offsetY: -10,
            color: "#03071e",
            fontSize: "13px",
          },
          value: {
            color: "#70e000",
            fontSize: "22px",
            show: true,
          },
        },
      },
    },
    theme: {
      mode: "light",
    },
  };

  deathRateChart = new ApexCharts($(".death-rate-chart"), options);
  deathRateChart.render();
};

const initialLastDaysChart = () => {
  const options = {
    chart: {
      type: "line",
      width: "100%",
    },
    colors: ["#d00000", "#76b041", "#081c15"],
    series: [],
    grid: {
      show: false,
    },
    xaxis: {
      categories: [],
      labels: {
        show: false,
      },
    },
    legend: {
      show: true,
      horizontalAlign: "center",
      offsetX: 40,
    },
    stroke: {
      curve: "smooth",
    },
    theme: {
      mode: "light",
    },
  };

  lastDaysChart = new ApexCharts($(".last-30-days-chart"), options);
  lastDaysChart.render();
};

const initialDarkMode = () => {
  let btnDarkMode = $(".header-darkmode");
  let body = $("body");

  let isDark = JSON.parse(localStorage.getItem("dark"));

  if (isDark) {
    body.classList.add("dark");
    btnDarkMode.classList.add("dark");
    // chart update light dark
    updateThemeChart(true);
  }

  btnDarkMode.onclick = () => {
    body.classList.toggle("dark");
    btnDarkMode.classList.toggle("dark");

    // chart update light dark
    updateThemeChart(body.classList.contains("dark"));

    localStorage.setItem(
      "dark",
      JSON.stringify(body.classList.contains("dark"))
    );
  };
};

const updateThemeChart = (addDark) => {
  let options = {
    theme: {
      mode: addDark ? "dark" : "light",
    },
  };

  allTimesChart.updateOptions(options);
  lastDaysChart.updateOptions(options);
  deathRateChart.updateOptions(options);
};

const getListCountry = (countries) => {
  let searchList = $(".search-list");
  let inputSearch = $(".search-list input");
  let searchInfo = $(".search-info");
  let searchText = $(".search-info span");
  let overlay = $(".overlay");

  const renderCountry = (filteredCountries) => {
    $$(".search-list li").forEach((e) => e.remove());

    filteredCountries.forEach((country) => {
      const item = document.createElement("li");
      item.textContent = country.Country;

      item.onclick = async () => {
        searchList.classList.remove("active");
        startLoading();
        await renderDataDefault(country.Slug);
        endLoading();
        searchText.textContent = country.Country;
        overlay.classList.remove("active");
      };

      searchList.appendChild(item);
    });
  };

  renderCountry(countries);

  inputSearch.onkeyup = (e) => {
    let value = e.target.value;
    let filteredCountries = countries.filter((item) =>
      item.Slug.toUpperCase().includes(value.toUpperCase())
    );
    renderCountry(filteredCountries);
  };

  searchInfo.onclick = () => {
    searchList.classList.add("active");
    overlay.classList.add("active");
  };

  overlay.onclick = () => {
    searchList.classList.remove("active");
    overlay.classList.remove("active");
  };
};

const startLoading = () => loader.classList.add("isLoading");

const endLoading = () => loader.classList.remove("isLoading");

//support utils
const numberWithComas = (text) => {
  return text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const customDate = (time) => {
  const date = new Date(time);
  return `${date.getDate()} - ${date.getMonth() + 1} - ${date.getFullYear()}`;
};
