import { Link } from "react-router-dom";

const recipes = [
  {
    name: "South Indian Chicken Biryani",
    time: "45 mins",
    difficulty: "Medium",
  },
  {
    name: "Traditional Sambar",
    time: "35 mins",
    difficulty: "Easy",
  },
  {
    name: "Chettinad Pepper Chicken",
    time: "50 mins",
    difficulty: "Medium",
  },
  {
    name: "Restaurant Style Fried Rice",
    time: "25 mins",
    difficulty: "Easy",
  },
];

export default function Recipes() {
  return (
    <main className="page">
      <div className="page-heading">
        <span className="eyebrow">SPICECRAFT KITCHEN</span>
        <h1>Recipes</h1>
        <p>Simple recipes. Bold flavours. Happy kitchens.</p>
      </div>

      <div className="recipe-grid">
        {recipes.map((recipe, index) => (
          <article className="recipe-card" key={recipe.name}>
            <div className="recipe-image">
              🍛
            </div>

            <div className="recipe-content">
              <span>Indian Cuisine</span>
              <h2>{recipe.name}</h2>

              <div className="recipe-meta">
                <span>⏱ {recipe.time}</span>
                <span>● {recipe.difficulty}</span>
              </div>

              <Link to={`/recipes/${index + 1}`}>
                View Recipe →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}