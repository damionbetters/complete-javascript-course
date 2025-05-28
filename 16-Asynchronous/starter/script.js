'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderCountry = function (data, className = '') {
  const html = `
  <article class="country ${className}">
            <img class="country__img" src="${
              data.flags?.png ?? 'default.png'
            }" />
            <div class="country__data">
              <h3 class="country__name">${data.name?.common ?? 'no name'}</h3>
              <h4 class="country__region">${data.region ?? 'no region'}</h4>
              <p class="country__row"><span>👨🏾‍🤝‍👩🏾</span>${
                (data.population / 1_000_000).toFixed(1) + ' million'
              } people</p>
              <p class="country__row"><span>🗣️</span>${
                Object.values(data.languages ?? {})[0] ?? 'No official language'
              }</p> 
              <p class="country__row"><span>💰</span>${
                Object.values(data.currencies ?? {})[0]?.name ??
                'No official currency'
              }</p>
            </div>
          </article>`;
  countriesContainer.insertAdjacentHTML('beforeend', html);
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};

const getCountryData = async function (country) {
  try {
    const url1 = `https://restcountries.com/v3.1/name/${country}?fullText=true`;
    // fetch first country data
    const response1 = await fetch(url1);
    if (!response1.ok)
      throw new Error(`Country not found: ${response1.status}`);

    const data1 = await response1.json();

    // render first country
    renderCountry(data1[0]);

    // get neighbor code
    const neighborCode = data1[0].borders?.[0];
    if (!neighborCode) throw new Error('No neighbor found 😢');

    // fetch neighbor country data

    const url2 = `https://restcountries.com/v3.1/alpha/${neighborCode}`;
    const response2 = await fetch(url2);
    if (!response2.ok)
      throw new Error(`Neighbor country no found: ${response2.status}`);
    const data2 = await response2.json();

    // render neighbor country
    renderCountry(data2[0], 'neighbour');

    // Error handling
  } catch (err) {
    console.error('❌ Something went wrong:', err);
    renderError(`Counldn't load country or neighbor. 🤦🏾‍♂️ ${err.message}`);
  } finally {
    countriesContainer.style.opacity = 1;
  }
};

btn.addEventListener('click', function () {
  getCountryData('Senegal');
});
