import React from "react";
import { Link } from "react-router-dom";
import "./Recipes.css";

const recipes = [
  {
    id: 1,
    title: "Classic Chicken Biryani",
    category: "Biryani",
    time: "45 mins",
    difficulty: "Medium",
    description:
      "Aromatic basmati rice layered with tender chicken and rich Indian spices.",
    image: "/images/recipe-biryani.jpg",
  },
  {
    id: 2,
    title: "South Indian Sambar",
    category: "Sambar",
    time: "35 mins",
    difficulty: "Easy",
    description:
      "A comforting lentil and vegetable sambar with authentic South Indian flavours.",
    image: "/images/recipe-sambar.jpg",
  },
  {
    id: 3,
    title: "Pepper Chicken",
    category: "Varuval",
    time: "30 mins",
    difficulty: "Easy",
    description:
      "A bold and aromatic chicken recipe finished with freshly ground black pepper.",
    image: "/images/recipe-pepper-chicken.jpg",
  },
  {
    id: 4,
    title: "Chettinad Vegetable Curry",
    category: "Kulambu",
    time: "40 mins",
    difficulty: "Medium",
    description:
      "A rich Chettinad-style curry prepared with roasted spices and fresh vegetables.",
    image: "/images/recipe-chettinad.jpg",
  },
];

const Recipes = () => {
  return (
    <main className="recipes-page">

      {/* ================= HERO ================= */}
      <section className="recipes-hero">
        <div className="recipes-hero-content">
          <span className="recipes-hero-eyebrow">
            FROM SPICECRAFT KITCHEN
          </span>

          <h1>Recipes Made Better with Spices</h1>

          <p>
            Discover simple Indian recipes and bring authentic flavour to your
            everyday cooking.
          </p>
        </div>
      </section>

      {/* ================= RECIPES ================= */}
      <section className="recipes-section">

        <div className="recipes-heading">
          <div>
            <span className="recipes-eyebrow">
              EXPLORE RECIPES
            </span>

            <h2>Cook Something Delicious</h2>
          </div>

          <p>
            Easy-to-follow recipes created around the flavours of authentic
            Indian spices.
          </p>
        </div>

        <div className="recipes-grid">
          {recipes.map((recipe) => (
            <article className="recipe-card" key={recipe.id}>

              {/* Recipe Image */}
              <Link
                to={`/recipes/${recipe.id}`}
                className="recipe-image"
              >
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  onError={(e) => {
                    e.currentTarget.src =
                      "/images/product-placeholder.jpg";
                  }}
                />
              </Link>

              {/* Recipe Content */}
              <div className="recipe-content">

                <span className="recipe-category">
                  {recipe.category}
                </span>

                <Link
                  to={`/recipes/${recipe.id}`}
                  className="recipe-title"
                >
                  {recipe.title}
                </Link>

                <p>{recipe.description}</p>

                <div className="recipe-meta">
                  <span>{recipe.time}</span>
                  <span>{recipe.difficulty}</span>
                </div>

                <Link
                  to={`/recipes/${recipe.id}`}
                  className="recipe-link"
                >
                  View Recipe →
                </Link>

              </div>
            </article>
          ))}
        </div>

      </section>

    </main>
  );
};

export default Recipes;