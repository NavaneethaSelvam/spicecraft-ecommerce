import { Link } from "react-router-dom";

export default function RecipeDetails() {
  return (
    <main className="page">
      <section className="recipe-detail-hero">
        <span className="eyebrow">SPICECRAFT RECIPE</span>

        <h1>South Indian Chicken Biryani</h1>

        <p>
          A fragrant, flavourful biryani made with perfectly balanced
          SpiceCraft masala.
        </p>

        <div className="recipe-meta large">
          <span>⏱ 45 mins</span>
          <span>● Medium</span>
          <span>🍽 Serves 4</span>
        </div>
      </section>

      <section className="recipe-detail-content">
        <div>
          <h2>Ingredients</h2>

          <ul className="ingredient-list">
            <li>Chicken – 500g</li>
            <li>Basmati rice – 500g</li>
            <li>Onion – 2</li>
            <li>Tomato – 2</li>
            <li>SpiceCraft Biryani Masala – 2 tbsp</li>
            <li>Ginger garlic paste – 1 tbsp</li>
          </ul>
        </div>

        <div>
          <h2>Cooking Steps</h2>

          <ol className="steps-list">
            <li>Marinate chicken with spices.</li>
            <li>Cook onions and tomatoes until soft.</li>
            <li>Add chicken and cook thoroughly.</li>
            <li>Add rice and required water.</li>
            <li>Cook until rice is fluffy.</li>
            <li>Rest for 10 minutes and serve hot.</li>
          </ol>
        </div>
      </section>

      <section className="recipe-product-cta">
        <h2>Cook this recipe with SpiceCraft</h2>
        <p>Get the masala used in this recipe.</p>

        <Link to="/product/1" className="btn btn-primary">
          Shop Biryani Masala
        </Link>
      </section>
    </main>
  );
}