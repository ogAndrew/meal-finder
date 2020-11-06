const search = document.getElementById('search'),
  submit = document.getElementById('submit'),
  random = document.getElementById('random'),
  mealsEl = document.getElementById('meals'),
  single_mealEl = document.getElementById('single-meal')
  
let resultHeading = document.getElementById('result-heading');

// Search meal and fetch API
function searchMeal(e) {
  e.preventDefault();
  
  // Clear Single Meal
  single_mealEl.innerHTML = '';
  // Get search term
  const term = search.value;
  
  // Check for empty
  if (term.trim()) {
    // fetch data
    const mealsUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
    fetch(mealsUrl)
      .then(res => res.json())
      .then(data => {
        resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`
     
        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There were no meals. Try again!</p>`;
        } else {
          mealsEl.innerHTML = data.meals
              .map(
                meal => `
              <div class="meal">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                <div class="meal-info" data-mealID="${meal.idMeal}">
                  <h3>${meal.strMeal}</h3>
                </div>
              </div>
            `
            )
            .join('');
        }
      });
      search.value = '';
  } else {
    alert('Please enter a value in the search bar');
  }
}

// Fetch meal by ID
function getMealBYId(mealID) {
  const mealUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
  fetch(mealUrl)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}

// Fetch random meal from API
function getRandomMeal() {
  mealsEl.innerHTML = '';
  resultHeading = '';

  const randomMealUrl = `https://www.themealdb.com/api/json/v1/1/random.php`;
  fetch(randomMealUrl)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0]
      console.log(meal);
      addMealToDOM(meal);
    })
}

// Add meal to DOM
function addMealToDOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  single_mealEl.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
      </div>
      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}

// Event Listeners
submit.addEventListener('submit', searchMeal)
random.addEventListener('click', getRandomMeal)

// mealsEL click event
mealsEl.addEventListener('click', e=> {
  const mealInfo = e.composedPath().find( item => {
    if (item.classList) {
      return item.classList.contains('meal-info');
    } else {
      return false;
    }
  })

  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid');
    getMealBYId(mealID);
  }
})