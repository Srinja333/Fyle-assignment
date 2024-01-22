
// const TOKEN="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"
const USER_API = "https://api.github.com/users/Srinja333";
const REPO_API = "https://api.github.com/users/Srinja333/repos";

const fetcher = async () => {
  const userData = await fetchUserData();
  const repoData = await fetchRepoData();

  if (userData && repoData) {
    stopLoading();
    const allCards = [...repoData];
    helper(15, 10, allCards, userData, []);
  }
};

//fetch github data
async function fetchUserData() {
  const apiUrl = USER_API;

  try {
    const response = await fetch(apiUrl
      // ,{
      //   headers : {
      //     "Authorization": "Bearer " + TOKEN
      // }
      // }
      );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function fetchRepoData() {
  const apiUrl = REPO_API;

  try {
    const response = await fetch(apiUrl
    //   ,{
    //   headers : {
    //     "Authorization": "Bearer " + TOKEN
    // }
    // }
    );
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

//helper function
function helper(mTop, data, allCards, userData, repoData) {
  let cardsPerPage = data; // Number of cards to show per page
  const dataContainer = document.getElementById("data-container");
  let dropbtn = document.getElementById("dropbtn");
  const dropdownContent = document.getElementById("dropdown-content");
  const pagination = document.getElementById("pagination");
  let prevButton = "";
  let nextButton = "";
  let pageLinks = "";
  let pageNumbers = "";
  let cards = [...repoData];
  let totalPages = 0;
  let currentPage = 1;
  let dropdownContentArr = [15, 20, 100];
  let tempDropDownContent = [];
  totalPages =
    repoData.length !== 0
      ? Math.ceil(repoData.length / cardsPerPage)
      : Math.ceil(allCards.length / cardsPerPage);
  pagination.style.marginTop = mTop.toString() + "rem";

  //search helper
  let searchedData = document.getElementById("search");
  const searchBtn = document.getElementById("searchBtn");

  searchBtn.addEventListener("click", async () => {
    let tempRepoData = [];
    let tempCards = [];
    try {
      startLoading();
      let tempSearchedData = searchedData.value;
      for (let i = 0; i < allCards.length; i++) {
        const particularCardlanguages = await fetchLanguages(
          allCards[i]?.languages_url
        );
        const keys = [];

        for (const [key, value] of Object.entries(particularCardlanguages)) {
          keys.push(key);
        }
    
        if (
          keys.includes(tempSearchedData) ||
          allCards[i]?.name?.includes(tempSearchedData) ||
          allCards[i]?.description?.includes(tempSearchedData)||
          keys.includes(tempSearchedData.toLowerCase()) ||
          allCards[i]?.name?.includes(tempSearchedData.toLowerCase()) ||
          allCards[i]?.description?.includes(tempSearchedData.toLowerCase())||
          keys.includes(tempSearchedData.toUpperCase()) ||
          allCards[i]?.name?.includes(tempSearchedData.toUpperCase()) ||
          allCards[i]?.description?.includes(tempSearchedData.toUpperCase())
        ) {
          tempCards.push(allCards[i]);
        }
      }
    } catch (err) {
      console.error("function failed:", err);
    } finally {
      stopLoading();
      tempRepoData = [...tempCards];
      mTop = 15;
      let paginationMarginTop = mTop + tempRepoData.length;

      if (tempRepoData.length == 0) {
        alert("no data found, now you will redirect to initial state");
        helper(15, 10, allCards, userData, []);
      } else {
        helper(
          paginationMarginTop,
          tempRepoData.length,
          allCards,
          userData,
          tempRepoData
        );
      }
    }
  });

  //dropdown helper
  dropdownContentArr.forEach((d) => {
    tempDropDownContent.push(
      `<a href="#" class="dropdown-link" id=${d}>${d}</a>`
    );
  });
  dropdownContent.innerHTML = `${tempDropDownContent.join("")}`;

  const dropdownLinks = document.querySelectorAll(".dropdown-link");

  dropdownLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const data = parseInt(link.getAttribute("id"));
      cardsPerPage = data;
      dropbtn.innerHTML = data;
      mTop = 15;
      let paginationMarginTop = mTop + data / 3;
      pagination.style.marginTop = paginationMarginTop.toString() + "rem";

      helper(paginationMarginTop, data, allCards, userData, repoData);
    });
  });

  //profile helper
  document.getElementById("profile-image").src = userData.avatar_url;
  document.querySelector(".profile-details .user-name").innerHTML =
    userData.name;
  document.querySelector(
    ".profile-details .user-bio"
  ).innerHTML = `Bio: ${userData.bio}`;
  document.querySelector(
    ".profile-details .user-location"
  ).innerHTML = `Location: ${userData.location}`;
  document.querySelector(".url-link").innerHTML = ` ${userData.html_url}`;
  document.querySelector(".url-link").href = ` ${userData.html_url}`;

  //pagination helper
  let allPages = [];

  for (let i = 1; i <= totalPages; i++) {
    allPages.push(`<a href="#" class="page-link" data-page="${i}">${i}</a>`);
  }

  pagination.innerHTML = `<a href="#" id="prev">Previous</a>
       
	   ${allPages.join(" ")}
	 	 <a href="#" id="next">Next</a>
	 <p id="page-numbers"> </p> `;

  prevButton = document.getElementById("prev");
  nextButton = document.getElementById("next");
  pageLinks = document.querySelectorAll(".page-link");
  pageNumbers = document.getElementById("page-numbers");

  //function calls
  displayPage(currentPage);

  if (
    pageNumbers !== "" &&
    prevButton !== "" &&
    nextButton !== "" &&
    pageLinks !== ""
  ) {
    updatePagination();
  }

  //fetch languages as per repo
  async function fetchLanguages(url) {
    const apiUrl = url;

    try {
      const response = await fetch(apiUrl
      //   ,{
      //   headers : {
      //     "Authorization": "Bearer " + TOKEN
      // }
      // }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Function to display cards for a specific page
  async function displayPage(page) {
    const startIndex = (page - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    const tempCards = [];
    if (repoData.length !== 0) {
      cards.forEach(async (card, index) => {
        if (index >= startIndex && index < endIndex) {
          const particularCardlanguages = await fetchLanguages(
            card?.languages_url
          );
          const keys = [];

          for (const [key, value] of Object.entries(particularCardlanguages)) {
            keys.push(key);
          }

          let particularCardBtns = [];

          keys.forEach((k) => {
            particularCardBtns.push(`<button id="lang-btn">${k}</button>`);
          });

          tempCards.push(`<div class="card">
      <h3>${card?.name}</h3>
      <p>${card.description || "Not added"}</p>
        <div id="btn-div" >
        ${particularCardBtns.join(" ")}
        </div>
      </div>`);

          document.getElementById("card-container").innerHTML =
            tempCards.join("");
        }
      });
    } else {
      allCards.forEach(async (card, index) => {
        if (index >= startIndex && index < endIndex) {
          const particularCardlanguages = await fetchLanguages(
            card?.languages_url
          );
          const keys = [];

          for (const [key, value] of Object.entries(particularCardlanguages)) {
            keys.push(key);
          }

          let particularCardBtns = [];

          keys.forEach((k) => {
            particularCardBtns.push(`<button id="lang-btn">${k}</button>`);
          });

          tempCards.push(`<div class="card">
			  <h3>${card?.name}</h3>
			  <p>${card.description || "Not added"}</p>
				  <div id="btn-div" >
				  ${particularCardBtns.join(" ")}
				  </div>
			  </div>`);

          document.getElementById("card-container").innerHTML =
            tempCards.join("");
        }
      });
    }
    tempCards.forEach((card, index) => {
      if (index >= startIndex && index < endIndex) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }

  // Function to update pagination buttons and page numbers
  async function updatePagination() {
    pageNumbers.textContent = `Page ${currentPage} of ${totalPages}`;
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
    pageLinks.forEach((link) => {
      const page = parseInt(link.getAttribute("data-page"));
      link.classList.toggle("active", page === currentPage);
    });
  }

  // Event listener for "Previous" button
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      displayPage(currentPage);
      updatePagination();
    }
  });

  // Event listener for "Next" button
  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      displayPage(currentPage);
      updatePagination();
    }
  });

  // Event listener for page number buttons
  pageLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = parseInt(link.getAttribute("data-page"));
      if (page !== currentPage) {
        currentPage = page;
        displayPage(currentPage);
        updatePagination();
      }
    });
  });
}

//loader functions
function stopLoading() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("data-container").style.display = "block";
  document.getElementById("pagination").style.display = "block";
  document.getElementById("navbar").style.display = "flex";
}

function startLoading() {
  document.getElementById("loader").style.display = "flex";
  document.getElementById("data-container").style.display = "none";
  document.getElementById("pagination").style.display = "none";
  document.getElementById("navbar").style.display = "none";
}

// Initial page load
startLoading();

fetcher();
