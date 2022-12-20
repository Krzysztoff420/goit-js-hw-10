import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const input = document.querySelector('input#search-box');
const countryList = document.querySelector('ul.country-list');
const countryInfo = document.querySelector('div.country-info');
const DEBOUNCE_DELAY = 300;


const isInputCorrect = (a) => {
  return /^[A-Za-z\s\-]*$/.test(a);
};

const countryCardCreator = ({ name, capital, population, flags, languages }) => {
  const allLanguages = languages.map(language => language.name).join(', ');
  const country = document.createElement('article');
  country.innerHTML = `
  <h3>
    <img src="${flags.svg}" alt="${name} flag" width="50px" />
    ${name}
  </h3>
  <p>Capital: ${capital === undefined ? '-' : capital} </p>
  <p>Population: ${population}</p>
  <p>Languages: ${allLanguages}</p>`;

  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
  countryInfo.append(country);
};

const countryListCreator = countries => {
  const allCountries = countries.map(({ flags, name }) => {
    const item = document.createElement('li');
    item.innerHTML = `
    <img src="${flags.svg}" alt="${name} flag" width="50px" /> ${name}`;

    return item;
  });
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
  countryList.append(...allCountries);
};



input.addEventListener(
  'input',
  debounce(event => {
    if (event.target.value === '') {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      return;
    }
    if (isInputCorrect(event.target.value)) {
      fetchCountries(event.target.value)
        .then(data => {
          if (data.length > 10)
            return Notiflix.Notify.info(
              `Too many matches found. Please enter a more specific name.`
            );
          if (data.length === 1) return countryCardCreator(data[0]);
          return countryListCreator(data);
        })
        .catch(() =>
          Notiflix.Notify.failure(`Oops, there is no country with that name!`)
        );
    } else {
      return Notiflix.Notify.info(
        `Alphabet only, please!`
      );
    }
  }, DEBOUNCE_DELAY)
);

