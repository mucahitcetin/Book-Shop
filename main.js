let bookList = [],
  basketList = [];

// toggle menu
const toggleModal = () => {
  const basketModal = document.querySelector(".basket__modal");
  basketModal.classList.toggle("active");
};
// json yapısı ile product.json dan ürünleri çektik
const getBooks = () => {
  fetch("./product.json")
    .then((res) => res.json())
    .then((books) => (bookList = books))
    .catch((err) => console.log(err));
};
getBooks()

// dinamik yıldızlar oluşturduk
const createBookStars = (starRate) => {
  let starRateHtml = "";
  for (let i = 1; i <= 5; i++) {
    if (Math.round(starRate) >= i) {
      starRateHtml += `<i class="bi bi-star-fill active"></i>`
    } else {
      starRateHtml += `<i class="bi bi-star-fill"></i>`
    }
  }
  return starRateHtml;
};

//html ekleme - ürünler
const createBookItemsHtml = () => {
  const bookListEl = document.getElementById('book__list');
  let bookListHtml = '';

  bookList.forEach((book, index) => {
    bookListHtml += `
      <div class="col-5 ${index % 2 == 0 && "offset-2"} my-5">
      <div class="row book__card">
        <div class="col-6">
          <img
            src="${book.imgSource}"
            alt=""
            class="img-fluid shadow"
            width="258px"
            height="400px"
          />
        </div>
        <div class="col-6 d-flex flex-column justify-content-center gap-4">
          <div class="book__detail">
            <span class="fos gray fs-5">${book.author}</span> <br />
            <span class="fs-4 fw-bold">${book.name}</span> <br />
            <span class="book__star-rate">
             ${createBookStars(book.starRate)}
              <span class="gray">1938 reviews</span>
            </span>
          </div>
          <p class="book__description fos gray">
           ${book.description}
          </p>
          <div>
            <span class="black fw-bold fs-4 me-2">${book.price}tl</span>
            <span class="fs-4 fw-bold old__price">${book.oldPrice
        ? `<span class="fs-4 fw-bold old__price">${book.oldPrice}tl</span>`
        : ""
      }</span>
          </div>
          <button class="btn__purple" onClick="addBookToBasket(${book.id
      })">Sepete Ekle</button>
        </div>
      </div>
    </div>
      `;
  });
  bookListEl.innerHTML = bookListHtml;
};

//kitapların türü
const BOOK_TYPES = {
  ALL: "Tümü",
  NOVEL: "Roman",
  CHILDREN: "Çocuk",
  HISTORY: "Tarih",
  FINANCE: "Finans",
  SCIENCE: "Bilim",
  SELFIMPROVEMENT: "Kişisel Gelişim",
};

//kitapların türüne göre ayarlama
const createBookTypesHtml = () => {
  const filterEle = document.querySelector(".filter");
  let filterHtml = "";
  // filtre türlerini tutacak dizi,"ALL" türüyle başlatılmıştır
  let filterTypes = ["ALL"];
  bookList.forEach((book) => {
    // eğer filtre türleri dizisinde bu tür bulunmuyorsa ekleme işlemi yapar
    if (filterTypes.findIndex((filter) => filter == book.type) == -1) {
      filterTypes.push(book.type);
    }
  });
  filterTypes.forEach((type, index) => {
    filterHtml += ` <li onClick="filterBooks(this)" data-types="${type}" class="${index == 0 ? "active" : null
      }">${BOOK_TYPES[type] || type}</li>`;
  });

  filterEle.innerHTML = filterHtml;
};
const filterBooks = (filterEle) => {
  document.querySelector(".filter.active").classList.remove("active");
  filterEle.classList.add("active");
  let bookType = filterEle.daraset.types;
  getBooks();
  if (bookType != "ALL") {
    bookList = bookList.filter((book) => book.type === bookType);
  }
  createBookItemsHtml();
};

const listBasketItems = () => {
  const basketListEl = document.querySelector(".basket__list");
  const basketCountEl = document.querySelector(".basket__count");
  console.log(basketList);
  const totalQuantity = basketList.reduce(
    (total, item) => total + item.quantity,
    0
  );
  basketCountEl.innerHTML = totalQuantity > 0 ? totalQuantity : null;
  const totalPriceEl = document.querySelector(".total__price");
  console.log(totalPriceEl);
  let basketListHtml = "";
  let totalPrice = 0;
  basketList.forEach((item) => {
    console.log(item);
    totalPrice += item.product.price * item.quantity;
    basketListHtml += `
    <li class="basket__item">
    <img
      src="${item.product.imgSource}"
      alt=""
      width="100"
      height="100"
    />
    <div class="basket__item-info">
      <h3 class="book__name">${item.product.name}</h3>
      <span class="book__price">${item.product.price}tl</span> <br />
      <span class="book__remove" onClick="removeItemBasket(${item.product.id})">Sepetten Kaldır</span>
    </div>
    <div class="book__count">
      <span class="decrease" onClick="decreaseItemToBasket(${item.product.id})">-</span>
      <span class="mx-2">${item.quantity}</span>
      <span class="increase" onClick="increaseItemToBasket(${item.product.id})">+</span>
    </div>
  </li>
    
    `;
  });
  basketListEl.innerHTML = basketListHtml
    ? basketListHtml
    : `<li class="basket__item">Sepette herhangi bir ürün bulunmuyor.Sepete ürün ekleyiniz.</li>`;
  totalPriceEl.innerHTML = totalPrice > 0 ? "Total:" + totalPrice + "tl" : null;
};

// sepete ürün ekleme
const addBookToBasket = (bookId) => {
  let findedBook = bookList.find((book) => book.id === bookId);
  if (findedBook) {
    // sepetteki ürünün zaten var olup olmadığını kontrol ettik
    const basketAlreadyIndex = basketList.findIndex((basket) => basket.product.id == book.id);
    // eğer sepet boşsa veya eklenen kitap sepette yoksa
    if (basketAlreadyIndex == -1) {
      let.addItem = { quantity: 1, product: findedBook };
      basketList.push(addItem);
    } else {
      // sepette zaten var olan bir kitap ekleniyorsa, miktarını arttır
      basketList[basketAlreadyIndex].quantity += 1;
    }
  }
  constbtnCheck = document.querySelector(".btnCheck");
  btnCheck.style.display = 'block';
  // sepet içeriğini güncelle ve görüntüle
  listBasketItems();
};
// sepetten ürünü kaldırma
const removeItemBasket = (bookId) => {
  const findIndex = basketList.findIndex((basket) => basket.product.id == bookId);
  // eğer kitap sepetin içinde bulunuyorsa
  if (findIndex != -1) {
    basketList.splice(findIndex, 1);
  }
  const btnCheck = document.querySelector(".btnCheck");
  btnCheck.style.display = "none";
  // sepet içeriğini günceller
  listBasketItems();
};
//sepetteki ürünün miktarını azaltma
const decreaseItemToBasket = (bookId) => {
  const findIndex = basketList.findIndex((basket) => basket.product.id == bookId);
  // eğer kitap sepet içinde bulunuyorsa
  if (findIndex != -1) {
    // eğer kitabın miktarı 1 den büyükse
    if (basketList[findIndex].quantity != 1) {
      basketList[findIndex].quantity -= 1;
    } else {
      removeItemBasket(bookId);
    }
  }
  // sepet içeriğini güncelle 
  listBasketItems();
};
//sepetteki ürünün miktarını arttırma
const increaseItemToBasket  = (bookId) => {
  const findIndex = basketList.findIndex((basket) => basket.product.id == bookId);
  if  (findIndex != -1) {
    basketList[findIndex].quantity+=1;
}
 // sepet içeriğini günceller
 listBasketItems();
};

// datanın gelmesini bekledik
setTimeout(() => {
  createBookItemsHtml();
  createBookTypesHtml();
}, 100);



