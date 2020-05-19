const API_KEY = '4e61d32c7f8095da04f6550d8cc3dd94';
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';

class DBService {

    getResource = async (url) => {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Не удалось получить данные по адресу: ${url}, ошибка: ${res.status}`);
        }
        return await res.json();
    };

    getTestCards = async () => {
        return await this.getResource('test.json');
    };

    getTestCard = async () => {
        return await this.getResource('card.json');
    };
}

let searchForm = document.querySelector('.search__form');
let cardsList = document.querySelector('.tv-shows__list');

const renderSearch = () => {
    new DBService().getTestCards().then((response) => {
        console.log(response);
        cardsList.textContent = '';
        response.results.forEach(({backdrop_path: backdrop, name, poster_path: poster, vote_average: vote}) => {
            let posterIMG = poster ? IMG_URL + poster : './img/no-poster.jpg';
            let backdropIMG = backdrop ? IMG_URL + backdrop : '';
            const card = document.createElement('li');
            card.className = 'tv-shows__item'
            card.innerHTML = `
					<a href="#" class="tv-card">
							${vote ? `<span class="tv-card__vote">${vote}</span>` : ''}
							<img class="tv-card__img" src="${posterIMG}" data-backdrop="${backdropIMG}" alt="${name}">
							<h3 class="tv-card__head">${name}</h3>
					</a>
			`;
            cardsList.insertAdjacentElement('beforeend', card);
        });
    });
};

renderSearch();


//menu
const leftMenu = document.querySelector(".left-menu");
const hamburger = document.querySelector(".hamburger");

hamburger.addEventListener('click', function () {

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

//смена карточки


const changeImage = event => {
    const target = event.target;
    if (target.matches('.tv-card__img')) {
        const changeImage = target.dataset.backdrop;
        target.dataset.backdrop = target.src;
        if (changeImage) {
            target.src = changeImage
        }
    }
};

cardsList.addEventListener('mouseover', changeImage);
cardsList.addEventListener('mouseout', changeImage);


// модалка

const modal = document.querySelector('.modal'),
	img = modal.querySelector('.tv-card__img'),
	link = modal.querySelector('.modal__link'),
	title = modal.querySelector('.modal__title'),
	genres = modal.querySelector('.genres-list'),
	rating = modal.querySelector('.rating'),
	description = modal.querySelector('.description');

cardsList.addEventListener('click', event => {
    const target = event.target.closest('.tv-card');

    if (target) {

        new DBService().getTestCard()
            .then(response => {
				console.log(response)
				img.src = IMG_URL + response.poster_path;
				img.alt = response.name;
				link.href = response.homepage;
				title.textContent = response.name;
				genres.textContent = '';
				response.genres.forEach(item => {
					genres.innerHTML += `<li>${item.name}</li>`
				})
				rating.textContent = response.vote_average;
				description.textContent = response.overview;
            })
            .then(() => {
                modal.classList.remove('hide')
            })
    }

});



;


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



