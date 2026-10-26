
import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock,
  ChefHat,
  Sparkles,
  UtensilsCrossed,
  Flame,
} from "lucide-react";

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
    tag: "CUSTOMER FAVOURITE",
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
    tag: "EVERYDAY CLASSIC",
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
    tag: "BOLD & SPICY",
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
    tag: "TRADITIONAL TASTE",
  },
];

function Recipes() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fffaf3] text-stone-900">
      {/* HERO SECTION */}
      <section className="relative isolate flex min-h-[390px] items-center overflow-hidden bg-[#302016] sm:min-h-[460px]">
        <img
          src="/images/hero-spices-2.jpg"
          alt="Authentic Indian spices"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#24150d]/95 via-[#382216]/80 to-[#382216]/35" />

        <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[10px] font-bold tracking-[0.2em] text-[#f0ca91] backdrop-blur-sm sm:text-xs">
              <Sparkles size={15} />
              FROM THE SPICECRAFT KITCHEN
            </div>

<h1
  style={{ color: "#ffffff" }}
  className="font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl"
>
  Recipes Made Better
  <span
    className="mt-2 block italic"
    style={{ color: "#e8bd78" }}
  >
    with Spices.
  </span>
</h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-white/85 sm:text-base sm:leading-8">
              Discover delicious Indian recipes, explore traditional flavours,
              and bring something special to your everyday cooking.
            </p>

            <a
              href="#recipe-collection"
              className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-lg bg-[#e8bd78] px-6 py-3 text-sm font-bold text-stone-900 transition duration-300 hover:-translate-y-0.5 hover:bg-[#f4d5a4]"
            >
              Explore Recipes
              <ArrowRight size={17} />
            </a>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-white/85 sm:text-sm">
              <span className="flex items-center gap-2">
                <LeafIcon />
                Authentic Indian flavours
              </span>
              <span className="flex items-center gap-2">
                <Clock size={15} className="text-[#e8bd78]" />
                Everyday-friendly recipes
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="px-4 pb-8 pt-12 sm:px-8 sm:pb-10 sm:pt-16 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8c3b1e] sm:text-xs">
              A little inspiration for your kitchen
            </span>

            <h2 className="mt-3 font-serif text-3xl font-bold text-stone-900 sm:text-4xl lg:text-5xl">
              Cook Something Delicious
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
              From comforting South Indian classics to bold, aromatic curries,
              discover recipes made for sharing.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start rounded-xl border border-[#eadbc9] bg-white px-4 py-3 md:self-auto">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4e7d5] text-[#804729]">
              <UtensilsCrossed size={19} />
            </span>
            <div>
              <p className="text-xl font-bold">{recipes.length}</p>
              <p className="text-xs text-stone-500">Featured recipes</p>
            </div>
          </div>
        </div>
      </section>

      {/* RECIPE COLLECTION */}
      <section
        id="recipe-collection"
        className="scroll-mt-20 px-4 pb-16 pt-5 sm:px-8 sm:pb-20 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex items-center justify-between border-b border-[#e8dac9] pb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8c3b1e] sm:text-xs">
                Handpicked for you
              </p>
              <h3 className="mt-1 font-serif text-xl font-bold sm:text-2xl">
                Featured Recipes
              </h3>
            </div>

            <span className="hidden items-center gap-2 text-xs font-semibold text-[#8c3b1e] sm:flex">
              <Flame size={16} />
              Made with authentic spices
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {recipes.map((recipe, index) => (
              <article
                key={recipe.id}
                className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#eadfd2] bg-white shadow-[0_5px_22px_rgba(62,38,22,0.05)] transition duration-300 hover:-translate-y-1.5 hover:border-[#d5b18b] hover:shadow-[0_15px_35px_rgba(62,38,22,0.12)]"
              >
                {/* Image */}
                <Link
                  to={`/recipes/${recipe.id}`}
                  aria-label={`View ${recipe.title} recipe`}
                  className="relative block h-56 overflow-hidden bg-[#e9dccb] sm:h-52 lg:h-56"
                >
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src =
                        "/images/dish-placeholder.jpg";
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-black/15" />

                  <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-[#fffaf3]/95 px-3 py-1.5 text-[9px] font-bold tracking-[0.1em] text-[#8c3b1e] shadow-sm">
                    {recipe.tag}
                  </span>

                  <span className="absolute bottom-3 left-3 rounded-lg bg-[#6f3d25]/90 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                    {recipe.category}
                  </span>

                  <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#fff3df] text-[#8c3b1e] transition duration-300 group-hover:bg-[#e8bd78]">
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex items-center gap-3 text-[11px] font-medium text-stone-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={14} className="text-[#8c3b1e]" />
                      {recipe.time}
                    </span>

                    <span className="h-1 w-1 rounded-full bg-[#c9b39b]" />

                    <span className="inline-flex items-center gap-1.5">
                      <ChefHat size={14} className="text-[#8c3b1e]" />
                      {recipe.difficulty}
                    </span>
                  </div>

                  <Link
                    to={`/recipes/${recipe.id}`}
                    className="font-serif text-xl font-bold leading-snug text-stone-900 transition-colors group-hover:text-[#8c3b1e]"
                  >
                    {recipe.title}
                  </Link>

                  <p className="mt-3 flex-1 text-sm leading-6 text-stone-600">
                    {recipe.description}
                  </p>

                  <div className="mt-5 border-t border-[#eee5da] pt-4">
                    <Link
                      to={`/recipes/${recipe.id}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-[#804729] transition-all hover:gap-3 hover:text-[#b45b2c]"
                    >
                      View Recipe
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Bottom callout */}
          <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-2xl border border-[#e8d7c2] bg-gradient-to-r from-[#f5e8d7] to-[#fff8ef] p-6 sm:flex-row sm:items-center sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#6f3d25] text-[#f4d29d]">
                <Sparkles size={22} />
              </div>

              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900 sm:text-2xl">
                  Great meals begin with great spices.
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">
                  Find the flavours you need for your next homemade favourite.
                </p>
              </div>
            </div>

        <Link
  to="/shop"
  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#783b25] px-5 py-3 text-sm font-bold transition hover:bg-[#4d2518]"
  style={{ color: "#ffffff" }}
>
  Shop Spices
  <ArrowRight size={16} />
</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function LeafIcon() {
  return <span className="text-[#e8bd78]">✦</span>;
}

export default Recipes;
