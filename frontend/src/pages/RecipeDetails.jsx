import React from "react";
import { Link, useParams } from "react-router-dom";
import "./RecipeDetails.css";

const recipes = [
  {
    id: 1,
    title: "Classic Chicken Biryani",
    category: "Biryani",
    time: "45 mins",
    difficulty: "Medium",
    servings: "4 Servings",
    image: "/images/recipe-biryani.jpg",
    description:
      "Aromatic basmati rice layered with tender chicken, caramelised onions and rich Indian spices.",
    ingredients: [
      "500g chicken",
      "2 cups basmati rice",
      "2 onions",
      "1 tomato",
      "2 tbsp Biryani Masala",
      "Ginger garlic paste",
      "Fresh coriander and mint",
      "Salt and oil",
    ],
    steps: [
      "Marinate the chicken with spices, salt and ginger garlic paste.",
      "Cook the basmati rice until it is about 70% done.",
      "Cook the marinated chicken with onions and tomatoes.",
      "Layer the rice over the chicken and add mint and coriander.",
      "Cover and cook on low heat until the flavours combine.",
    ],
  },
  {
    id: 2,
    title: "South Indian Sambar",
    category: "Sambar",
    time: "35 mins",
    difficulty: "Easy",
    servings: "4 Servings",
    image: "/images/recipe-sambar.jpg",
    description:
      "A comforting South Indian sambar prepared with lentils, vegetables and aromatic spices.",
    ingredients: [
      "1 cup toor dal",
      "Mixed vegetables",
      "1 onion",
      "1 tomato",
      "2 tbsp Sambar Powder",
      "Tamarind",
      "Curry leaves",
      "Salt",
    ],
    steps: [
      "Pressure cook the toor dal until soft.",
      "Cook the vegetables with onion and tomato.",
      "Add tamarind water and Sambar Powder.",
      "Mix in the cooked dal and simmer.",
      "Finish with a tempering of curry leaves and spices.",
    ],
  },
  {
    id: 3,
    title: "Pepper Chicken",
    category: "Varuval",
    time: "30 mins",
    difficulty: "Easy",
    servings: "3 Servings",
    image: "/images/recipe-pepper-chicken.jpg",
    description:
      "A bold and aromatic chicken recipe finished with freshly ground black pepper.",
    ingredients: [
      "500g chicken",
      "2 onions",
      "1 tomato",
      "2 tbsp black pepper",
      "Ginger garlic paste",
      "Curry leaves",
      "Salt and oil",
    ],
    steps: [
      "Marinate chicken with salt, pepper and ginger garlic paste.",
      "Sauté onions and curry leaves until golden.",
      "Add tomatoes and cook until soft.",
      "Add chicken and cook thoroughly.",
      "Finish with freshly ground black pepper.",
    ],
  },
  {
    id: 4,
    title: "Chettinad Vegetable Curry",
    category: "Kulambu",
    time: "40 mins",
    difficulty: "Medium",
    servings: "4 Servings",
    image: "/images/recipe-chettinad.jpg",
    description:
      "A rich Chettinad-style curry prepared with roasted spices and fresh vegetables.",
    ingredients: [
      "Mixed vegetables",
      "1 onion",
      "2 tomatoes",
      "Chettinad spice blend",
      "Coconut",
      "Curry leaves",
      "Salt and oil",
    ],
    steps: [
      "Roast the spices and coconut until aromatic.",
      "Grind the roasted mixture into a smooth paste.",
      "Sauté onions and tomatoes.",
      "Add vegetables and the spice paste.",
      "Simmer until the vegetables are cooked and the curry thickens.",
    ],
  },
];

const RecipeDetails = () => {
  const { id } = useParams();

  const recipe = recipes.find((item) => item.id === Number(id));

  if (!recipe) {
    return (
      <main className="recipe-not-found">
        <span>SPICECRAFT</span>
        <h1>Recipe Not Found</h1>
        <p>We couldn't find the recipe you're looking for.</p>
        <Link to="/recipes">Back to Recipes</Link>
      </main>
    );
  }

  return (
    <main className="recipe-details-page">

      <div className="recipe-details-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/recipes">Recipes</Link>
        <span>/</span>
        <span>{recipe.title}</span>
      </div>

      <section className="recipe-details-hero">

        <div className="recipe-details-image">
          <img
            src={recipe.image}
            alt={recipe.title}
            onError={(e) => {
              e.currentTarget.src = "/images/product-placeholder.jpg";
            }}
          />
        </div>

        <div className="recipe-details-info">

          <span className="recipe-details-category">
            {recipe.category}
          </span>

          <h1>{recipe.title}</h1>

          <p className="recipe-details-description">
            {recipe.description}
          </p>

          <div className="recipe-details-meta">
            <div>
              <span>TIME</span>
              <strong>{recipe.time}</strong>
            </div>

            <div>
              <span>DIFFICULTY</span>
              <strong>{recipe.difficulty}</strong>
            </div>

            <div>
              <span>SERVINGS</span>
              <strong>{recipe.servings}</strong>
            </div>
          </div>

        </div>

      </section>

      <section className="recipe-content-section">

        <div className="ingredients-section">
          <span className="recipe-section-eyebrow">WHAT YOU NEED</span>
          <h2>Ingredients</h2>

          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>

        <div className="steps-section">
          <span className="recipe-section-eyebrow">LET'S COOK</span>
          <h2>Method</h2>

          <div className="recipe-steps">
            {recipe.steps.map((step, index) => (
              <div className="recipe-step" key={index}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>

      </section>

      <section className="recipe-bottom">
        <h2>Ready to cook?</h2>
        <p>Bring authentic Indian flavour to your kitchen with SpiceCraft.</p>

        <Link to="/shop">Shop Our Spices →</Link>
      </section>

    </main>
  );
};

export default RecipeDetails;