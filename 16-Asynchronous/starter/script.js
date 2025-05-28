'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const getCountryData = function (country) {
  let neighbor;

  fetch(`https://restcountries.com/v3.1/name/${country}?fullText=true`)
    .then(response => response.json())
    .then(data => {
      renderCountry(data[0]);
      const neighbor = data[0].borders[0];
      return fetch(`https://restcountries.com/v3.1/alpha/${neighbor}`);
    })
    .then(response => response.json())
    .then(data => renderCountry(data[0], 'neighbour'));
};

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
  countriesContainer.style.opacity = 1;
};

getCountryData('Senegal');
