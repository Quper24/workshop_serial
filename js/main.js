const API_KEY = '4e61d32c7f8095da04f6550d8cc3dd94';

class DBService {

	getResource = async (url) => {
		const res = await fetch(url);
		if (!res.ok) {
			throw new Error(`Could not fetch , received ${res.status}`);
		}
		return await res.json();
	};

	getSearch = async (text) => {
		return await this.getResource(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&language=ru-RU&page=1&include_adult=false&query=${text}`);
	};

	getTest = async () => {
		return await this.getResource('test.json');
	};
}

let searchForm = document.querySelector('.search__form');
let result = document.querySelector('.tv-shows__list');

const renderSearch = () => {


	new DBService().getTest('star Wars').then((response) => {
		console.log(response);
		let inner = '';

		response.results.forEach(({ backdrop_path: backdrop, name, id,  poster_path: poster, vote_average: vote}) => {
			let posterIMG = poster ? `https://image.tmdb.org/t/p/w185_and_h278_bestv2${poster}` : './img/no-poster.jpg';
			inner += `
				<li class="tv-shows__item">
					<article class="tv-card">
						${vote ? `<span class="tv-card__vote">${vote}</span>` : ''}
						<img class="tv-card__img" src="${posterIMG}" data-backdrop="${backdrop}" alt="${name}">
						<h3 class="tv-card__head">${name}</h3>
						<button class="tv-card__description" data-id="${id}">Описание</button>
					</article>
				</li>
                    `;

		});
		result.innerHTML = inner;
	});


};

renderSearch();


searchForm.addEventListener('submit', e => {
	e.preventDefault();
	let searchText = document.querySelector('.form-control').value;
	let request = new XMLHttpRequest();

	request.open('GET', 'https://api.themoviedb.org/3/search/tv?api_key=4e61d32c7f8095da04f6550d8cc3dd94&language=ru-RU&page=1&include_adult=false&query=' + searchText);

	request.send();

	request.addEventListener('readystatechange', function() {


		if (request.readyState < 4) {
			result.innerHTML = 'Загрузка';
		} else if (request.readyState === 4) {
			if (request.status === 200 && request.status < 300) {

				let output = JSON.parse(this.responseText);

				let inner = '';

				for (let resultsKey in output.results) {
					let movie = output.results[resultsKey];
					let posterIMG = movie.poster_path ? `https://image.tmdb.org/t/p/w185_and_h278_bestv2${movie.poster_path}` : './img/no-poster.jpg';
					genres.push(movie.genre_ids);
					console.log(movie.genre_ids);
					inner += `
                        <div class="col-md-3">
                            <div class="well text-center">
                                <img src="${posterIMG}">
                                    <h5>${movie.title}</h5>
                                <a class="btn btn-primary" href="#">Описание</a>
                            </div>
                        </div>
                    `;

				}
				result.innerHTML = inner;


				console.log('Status:', this.status);
				console.log('Body:', output.results);

			}
		} else {
			result.innerHTML = 'Error';
		}


	});


});


//menu
const leftMenu = document.querySelector(".leftMenu");
const hamburger = document.querySelector(".hamburger");

hamburger.addEventListener('click', function() {

	leftMenu.classList.toggle("openMenu");
	hamburger.classList.toggle("open");


});

leftMenu.addEventListener('click', (event) => {
	const target = event.target;
	const dropdown = target.closest('.dropdown');
	if (dropdown) {
		dropdown.classList.toggle('active');
		leftMenu.classList.add("openMenu");
		hamburger.classList.add("open");
	}


});

// id 33123
// 1396

//получить жанр

// меню
// https://developers.themoviedb.org/3/tv/get-top-rated-tv - топ рейтинг
// https://developers.themoviedb.org/3/tv/get-popular-tv-shows - популярные

// https://developers.themoviedb.org/3/tv/get-tv-airing-today - что показываю сегодня
// https://developers.themoviedb.org/3/tv/get-tv-on-the-air - что будет на этой недели


// карточка сериала
// https://developers.themoviedb.org/3/tv/get-tv-details - полное описание с сезонами
//  https://developers.themoviedb.org/3/tv/get-tv-recommendations - рекомендации
// https://developers.themoviedb.org/3/tv/get-similar-tv-shows - похожие
// https://developers.themoviedb.org/3/tv/get-tv-videos - видео
// https://developers.themoviedb.org/3/tv-seasons/get-tv-season-details - описание сезона



