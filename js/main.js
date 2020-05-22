const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const API_KEY = '4e61d32c7f8095da04f6550d8cc3dd94';
const leftMenu = document.querySelector(".left-menu"),
    hamburger = document.querySelector(".hamburger"),
    cardsList = document.querySelector('.tv-shows__list'),
    modal = document.querySelector('.modal'),
    img = modal.querySelector('.tv-card__img'),
    link = modal.querySelector('.modal__link'),
    title = modal.querySelector('.modal__title'),
    genres = modal.querySelector('.genres-list'),
    rating = modal.querySelector('.rating'),
    description = modal.querySelector('.description'),
    tvShows = document.querySelector('.tv-shows'),
    preloader = document.querySelector('.preloader'),
    searchForm = document.querySelector('.search__form'),
    searchFormInput = document.querySelector('.search__form-input'),
    headSearch = document.querySelector('.tv-shows__head');


const loading = document.createElement('div');
loading.className = 'loading';


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

    getSearchResult = async (query) => {
        return await this.getResource('https://api.themoviedb.org/3/search/tv?api_key=' +
            API_KEY +
            '&language=ru-RU&page=1&include_adult=false&query=' +
            query);
    };

    getTvShow = async (id) => {
        return await this.getResource(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=ru-RU`);
    };

    getTopRated = async () => {
        return await this.getResource(`https://api.themoviedb.org/3/tv/top_rated?api_key=4e61d32c7f8095da04f6550d8cc3dd94&language=ru-RU&page=1`);
    };

    getPopular = async () => {
        return await this.getResource(`https://api.themoviedb.org/3/tv/popular?api_key=4e61d32c7f8095da04f6550d8cc3dd94&language=ru-RU&page=1`);
    };

    getToday = async () => {
        return await this.getResource(`https://api.themoviedb.org/3/tv/airing_today?api_key=4e61d32c7f8095da04f6550d8cc3dd94&language=ru-RU&page=1`);
    };

    getWeek = async () => {
        return await this.getResource(`https://api.themoviedb.org/3/tv/on_the_air?api_key=4e61d32c7f8095da04f6550d8cc3dd94&language=ru-RU&page=1`);
    };


}


const renderCards = (response, target) => {
    
    cardsList.textContent = '';

    if (!response.total_results) {
        loading.remove();
        headSearch.textContent = 'К сожалению по вашему запросу ничего не найдено...';
        return;
    }

    headSearch.textContent = target ? target.textContent : 'Результат поиска:'

    response.results.forEach(item => {
        const {
            backdrop_path: backdrop,
            name: title,
            poster_path: poster,
            vote_average: vote,
            id
        } = item;

        const posterIMG = poster ? IMG_URL + poster : './img/no-poster.jpg';
        const backdropIMG = backdrop ? IMG_URL + backdrop : '';
        const voteValue = vote ? `<span class="tv-card__vote">${vote}</span>` : '';

        const card = document.createElement('li');
        card.className = 'tv-shows__item'
        card.innerHTML = `
			<a href="#" class="tv-card" id="${id}">
				${voteValue}
				<img class="tv-card__img"
					src="${posterIMG}"
					data-backdrop="${backdropIMG}"
					alt="${title}">
				<h4 class="tv-card__head">${title}</h4>
			</a>
		`;
        loading.remove();
        cardsList.insertAdjacentElement('beforeend', card);
    });
};

searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const value = searchFormInput.value;
    searchFormInput.style.borderTopColor = '';
    if (value.trim()) {
        tvShows.append(loading);
        new DBService().getSearchResult(value).then(renderCards);
    } else {
        searchFormInput.style.borderTopColor = 'red';
    }
    return false
});

leftMenu.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;

    if (target.closest('#top-rated')) {
        new DBService().getTopRated().then(response => renderCards(response, target));
    }

    if (target.closest('#popular')) {
        new DBService().getPopular().then(response => renderCards(response, target));
    }

    if (target.closest('#today')) {
        new DBService().getToday().then(response => renderCards(response, target));
    }

    if (target.closest('#week')) {
        new DBService().getWeek().then(response => renderCards(response, target));
    }

    if (target.closest('#search')) {
        cardsList.textContent = '';
    }

});


// 1) открытие/закрытие на кнопку
hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle("openMenu");
    hamburger.classList.toggle("open");
});

// 2) закрытие по клику мимо меню
document.body.addEventListener('click', event => {
    if (!event.target.closest('.left-menu')) {
        leftMenu.classList.remove("openMenu");
        hamburger.classList.remove("open");
    }
});

// 3) раскрытие dropmenu
leftMenu.addEventListener('click', event => {
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
        // 4) открывать меню при клике на иконки
        leftMenu.classList.add("openMenu");
        hamburger.classList.add("open");
    }
});


//модальное окно

//открытие
cardsList.addEventListener('click', event => {
    const target = event.target.closest('.tv-card');

    if (target) {
        preloader.style.display = 'block';
        new DBService().getTvShow(target.id)
            .then(response => {
                img.src = IMG_URL + response.poster_path;
                img.alt = response.name;
                if (response.homepage) {
                    link.href = response.homepage;
                    link.style.display = '';
                } else {
                    link.style.display = 'none';
                }
                title.textContent = response.name;
                genres.textContent = '';
                response.genres.forEach(item => {
                    genres.innerHTML += `<li>${item.name}</li>`
                });
                rating.textContent = response.vote_average;
                description.textContent = response.overview;
            })
            .then(() => {
                document.body.style.overflow = 'hidden';
                modal.classList.remove('hide');
            })
            .then(() => {
                preloader.style.display = 'none';
            })
    }
});


//закрытие
modal.addEventListener('click', event => {
    if (event.target.classList.contains('modal') ||
        event.target.classList.contains('cross')) {
        modal.classList.add('hide');
        document.body.style.overflow = '';
    }
});


//смена карточки
const changeImage = event => {
    const target = event.target;
    if (target.matches('.tv-card__img') && target.dataset.backdrop) {
        [target.dataset.backdrop, target.src] = [target.src, target.dataset.backdrop]
    }
};
cardsList.addEventListener('mouseover', changeImage);
cardsList.addEventListener('mouseout', changeImage);