const JSON_PATH = 'https://api.pokemontcg.io/v2/cards/';

const SORT_NUMBER_ASC = function (a, b) {
  return a.cardmarket.prices.averageSellPrice - b.cardmarket.prices.averageSellPrice;
};

const SORT_NUMBER_DESC = function (a, b) {
  return b.cardmarket.prices.averageSellPrice - a.cardmarket.prices.averageSellPrice;
};

const SORT_ALPHA_TITLE = function (a, b) {
  const titleA = a.name;
  const titleB = b.name;
  if (titleA < titleB) { return -1; }
  if (titleA > titleB) { return 1; }
  return 0;
};



  let cont = document.querySelectorAll('.card');
  let select = document.getElementById("types");


  function chooseType() {
    var text = select.options[select.selectedIndex].text;
   
   for(var i=0; i< cont.length; i++){
     if(cont[i].types.toLowerCase().includes(text.toLowerCase())){
       cont[i].classList.remove("hidden");
     } else {
       cont[i].classList.add("hidden");
     }
   }
}

select.onchange = chooseType;
chooseType();


function liveSearch() {
  let cont = document.querySelectorAll('.card');
  let search_query = document.getElementById("searchbar").value;
  for (var i = 0; i < cont.length; i++) {
    if (cont[i].innerText.toLowerCase()
      .includes(search_query.toLowerCase())) {
      cont[i].classList.remove("hidden");
    } else {
      cont[i].classList.add("hidden");
    }
  }
}


class App {
  constructor() {
    this._onJsonReady = this._onJsonReady.bind(this);
    this._sortCards = this._sortCards.bind(this);

    const ascElement = document.querySelector('#asc');
    const ascButton = new SortButton(
      ascElement, this._sortCards, SORT_NUMBER_ASC);

    const descElement = document.querySelector('#desc');
    const descButton = new SortButton(
      descElement, this._sortCards, SORT_NUMBER_DESC);

    const alphaElement = document.querySelector('#alpha');
    const alphaButton = new SortButton(
      alphaElement, this._sortCards, SORT_ALPHA_TITLE);
  }


  _renderCards() {
    const Container = document.querySelector('#container');
    Container.innerHTML = '';
    for (const info of this.cardInfo) {
      const card = new Cards(Container, info.images.large, info.name, info.cardmarket.prices.averageSellPrice, info.types, info.cardmarket.url);
    }
  }

  loadCards() {
    fetch(JSON_PATH)
      .then(this._onResponse)
      .then(this._onJsonReady);
  }

  _onJsonReady(json) {
    this.cardInfo = json.data;
    console.log(this.cardInfo);
    this._renderCards();
  }

  _onResponse(response) {
    return response.json();
  }

  _sortCards(sortFunction) {
    console.log(this.cardInfo);
    this.cardInfo.sort(sortFunction);
    this._renderCards();
  }

}

class SortButton {
  constructor(containerElement, onClickCallback, sortFunction) {
    this._onClick = this._onClick.bind(this);
    this.onClickCallback = onClickCallback;

    this.sortFunction = sortFunction;
    containerElement.addEventListener('click', this._onClick);
  }

  _onClick() {
    this.onClickCallback(this.sortFunction);
    console.log("click");
  }
}

class Cards {
  constructor(Container, image_url, name, price, type, price_url) {
    const image = new Image();
    const h2 = document.createElement('h2');
    const p = document.createElement('p');
    const cardContainer = document.createElement('div');
    const btC = document.createElement('button');
    const t = document.createElement('p');
    const urll = document.createElement('a');
    h2.innerHTML = name;
    image.src = image_url;
    p.innerHTML = "Price:" + price + "€";
    t.innerText = type;
    urll.href = price_url;
    urll.innerText = 'Comprar';
    cardContainer.append(h2);
    cardContainer.append(image);
    cardContainer.append(p);
    cardContainer.append(btC);
    cardContainer.append(t);
    t.classList.add("hidden");
    image.classList.add("imgs");
    btC.append(urll);
    btC.classList.add("button-74");
    cardContainer.classList.add("card");
    Container.append(cardContainer);
  }
}


const app = new App();
app.loadCards();

