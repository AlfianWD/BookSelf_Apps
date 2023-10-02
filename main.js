const storageKey = "STORAGE_KEY";
const submitAction = document.getElementById("formBook");
const RENDER_EVENT = "render_bookself";
let listDataBook = [];

function generateId() {
  return +new Date();
}

function checkStorage() {
  return typeof Storage !== "undefined";
}

function putDataList(data) {
  if (checkStorage()) {
    if (localStorage.getItem(storageKey) !== null) {
      listDataBook = JSON.parse(localStorage.getItem(storageKey));
    }

    listDataBook.push(data);

    if (listDataBook.length > 5) {
      listDataBook.shift();
    }

    localStorage.setItem(storageKey, JSON.stringify(listDataBook));
  }
}

function findBookIndex(bookListId) {
  listDataBook = getDataList();
  for (let index = 0; index < listDataBook.length; index++) {
    if (listDataBook[index].id == bookListId) {
      return index;
    }
  }
  return -1;
}

function getDataList() {
  if (checkStorage()) {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } else {
    return [];
  }
}

submitAction.addEventListener("submit", function (event) {
  var Tittle = document.getElementById("inputTittle").value;
  var Author = document.getElementById("inputAuthor").value;
  var Year = document.getElementById("inputYear").value;
  var isComplete = document.getElementById("inputCheck");

  var newData = {
    id: generateId(),
    Tittle: Tittle,
    Author: Author,
    Year: Year,
    isComplete: isComplete.checked ? "sudah" : "belom selesai",
  };

  putDataList(newData);

  document.dispatchEvent(new Event(RENDER_EVENT));
});

function makeBookSelfList(bookListObject) {
  const { id, Tittle, Author, Year, isComplete } = bookListObject;

  const textTitle = document.createElement("h4");
  textTitle.innerText = Tittle;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = `Author: ${Author}`;

  const textTimestamp = document.createElement("p");
  textTimestamp.innerText = `Year: ${Year}`;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textAuthor, textTimestamp);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `dataBookList-${id}`);

  container.isComplete = isComplete;

  if (isComplete === "belom selesai") {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");
    checkButton.addEventListener("click", function () {
      addTaskToCompleted(id);
    });

    container.append(checkButton);
  } else if (isComplete === "sudah") {
    const backButton = document.createElement("button");
    backButton.classList.add("back-button");
    backButton.addEventListener("click", function () {
      backTaskToCompleted(id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");
    trashButton.addEventListener("click", function () {
      removeTaskFromCompleted(id);
    });

    container.append(backButton, trashButton);
  }

  return container;
}

function addTaskToCompleted(bookListId) {
  const indexToMove = findBookIndex(bookListId);
  if (indexToMove !== -1) {
    const bookToMove = listDataBook[indexToMove];
    bookToMove.isComplete = "sudah";

    putDataList(bookToMove);
    removeDataList(bookListId);
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function backTaskToCompleted(bookListId) {
  const indexToBack = findBookIndex(bookListId);
  console.log("Index to move:", indexToBack);

  if (indexToBack !== -1) {
    const bookToBack = listDataBook[indexToBack];
    bookToBack.isComplete = "belom selesai";

    putDataList(bookToBack);
    removeDataList(bookListId);
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function removeDataList(bookListId) {
  const indexToRemove = findBookIndex(bookListId);
  if (indexToRemove !== -1) {
    listDataBook.splice(indexToRemove, 1);
    localStorage.setItem(storageKey, JSON.stringify(listDataBook));
  }
}

function removeTaskFromCompleted(bookListId) {
  removeDataList(bookListId);
  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookList = document.getElementById(
    "incompleteBookshelfList"
  );
  const listCompleted = document.getElementById("completeBookshelfList");

  uncompletedBookList.innerHTML = "";
  listCompleted.innerHTML = "";

  const listDataBook = getDataList();

  for (const BookItem of listDataBook) {
    const BookElement = makeBookSelfList(BookItem);
    if (BookElement.isComplete === "belom selesai") {
      uncompletedBookList.append(BookElement);
    } else {
      const completeBookElement = makeBookSelfList(BookItem);
      listCompleted.append(completeBookElement);
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  document.dispatchEvent(new Event(RENDER_EVENT));
});
