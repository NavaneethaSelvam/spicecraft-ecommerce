import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Flame,
  Leaf,
  ShieldCheck,
  Truck,
  Clock,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import HeroCarousel from "../components/HeroCarousel";
import api from "../api";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const categories = [
  { name: "Masala Powders", count: 12, image: "/images/category-masala-powders.jpg" },
  { name: "Spice Blends", count: 10, image: "/images/category-spice-blends.jpg" },
  { name: "Curry Pastes", count: 8, image: "/images/category-curry-pastes.jpg" },
  { name: "Podis", count: 8, image: "/images/category-podis.jpg" },
  { name: "Pickles", count: 7, image: "/images/category-pickles.jpg" },
  { name: "Pure Spices", count: 14, image: "/images/category-pure-spices.jpg" },
];

const dishes = [
  { name: "Biryani", image: "/images/dish-biryani.jpg", description: "Rich & aromatic", number: "01" },
  { name: "Sambar", image: "/images/dish-sambar.jpg", description: "Everyday comfort", number: "02" },
  { name: "Rasam", image: "/images/dish-rasam.jpg", description: "Warm & flavourful", number: "03" },
  { name: "Kulambu", image: "/images/dish-kulambu.jpg", description: "Traditional taste", number: "04" },
  { name: "Varuval", image: "/images/dish-varuval.jpg", description: "Bold & spicy", number: "05" },
  { name: "Idli & Dosa", image: "/images/dish-idli-dosa.jpg", description: "South Indian classics", number: "06" },
];

const products = [
  { id: 1, name: "Chicken Biryani Masala", price: 149, image: "/images/bestseller-chicken-biryani.jpg", spiceLevel: 2 },
  { id: 2, name: "Chettinad Masala", price: 129, image: "/images/bestseller-chettinad.jpg", spiceLevel: 3 },
  { id: 3, name: "Sambar Powder", price: 99, image: "/images/bestseller-sambar.jpg", spiceLevel: 1 },
  { id: 4, name: "Garlic Podi", price: 89, image: "/images/bestseller-garlic-podi.jpg", spiceLevel: 2 },
];

const recipes = [
  { name: "Chicken Dum Biryani", time: "45 min", type: "LUNCH", image: "/images/dish-biryani.jpg" },
  { name: "Traditional Sambar", time: "30 min", type: "DINNER", image: "/images/dish-sambar.jpg" },
  { name: "Crispy Dosa", time: "20 min", type: "BREAKFAST", image: "/images/dish-idli-dosa.jpg" },
  { name: "Spicy Chettinad Curry", time: "40 min", type: "DINNER", image: "/images/dish-varuval.jpg" },
];

const trustItems = [
  { title: "100% Pure & Natural", text: "No Added Preservatives", icon: Leaf },
  { title: "Premium Quality", text: "Sourced from Trusted Farms", icon: ShieldCheck },
  { title: "Fast & Safe Delivery", text: "Across India", icon: Truck },
  { title: "Dedicated Support", text: "We're Here to Help", icon: CheckCircle2 },
];

const storySteps = [
  { number: "01", title: "Choose Your Flavour", text: "Discover a spice blend made for your favourite dish." },
  { number: "02", title: "Cook with Confidence", text: "Bring authentic Indian flavours into your kitchen." },
  { number: "03", title: "Share the Goodness", text: "Make everyday meals worth gathering around." },
];

const normalize = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/\.(jpg|jpeg|png|webp|avif)$/i, "")
    .replace(/^category-/, "")
    .replace(/^dish-/, "")
    .replace(/^product-/, "")
    .replace(/^bestseller-/, "")
    .replace(/^recipe-/, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function mediaMatches(media, names = []) {
  const candidates = [
    media.title,
    media.alt_text,
    media.object_key,
  ].filter(Boolean).map(normalize);

  return names.some((name) => {
    const key = normalize(name);
    return candidates.some(
      (candidate) =>
        candidate === key ||
        candidate.endsWith(`-${key}`) ||
        key.endsWith(`-${candidate}`)
    );
  });
}

function getMediaForItem(mediaList, item, aliases = []) {
  return mediaList.find((media) =>
    mediaMatches(media, [item.name, ...aliases])
  );
}

function getMediaTitle(media) {
  return String(media.title || media.alt_text || "SpiceCraft")
    .replace(/\.(jpg|jpeg|png|webp|avif)$/i, "")
    .replace(/^(category|dish|product|bestseller|recipe)-/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function ImageWithFallback({ src, fallback, alt, className }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src) return null;

  return (
    <img
      src={failed ? fallback : src}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => {
        if (!failed && fallback && src !== fallback) {
          setFailed(true);
        }
      }}
    />
  );
}

function SectionTitle({ eyebrow, title, description, action, to = "/shop" }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="mb-7 flex flex-col gap-4 sm:mb-9 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#8c3b1e] sm:text-xs">
          {eyebrow}
        </p>
        <h2 className="font-serif text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl lg:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">
            {description}
          </p>
        )}
      </div>
      {action && (
        <Link
          to={to}
          className="group inline-flex w-fit shrink-0 items-center gap-2 text-sm font-bold text-[#8c3b1e] transition-colors hover:text-[#b45b2c]"
        >
          {action}
          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      )}
    </motion.div>
  );
}

function TrustStrip() {
  return (
    <section className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-2 overflow-hidden rounded-2xl border border-[#eee0ce] bg-[#f8efe3] shadow-sm sm:grid-cols-4"
      >
        {trustItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              variants={fadeUp}
              key={item.title}
              whileHover={{ backgroundColor: "#f2e3d1" }}
              className={`flex items-center gap-3 px-3 py-4 transition-colors sm:px-5 sm:py-6 ${
                index % 2 === 1 ? "border-l border-[#e6d4bf]" : ""
              } ${
                index > 1 ? "border-t border-[#e6d4bf] sm:border-t-0" : ""
              } ${index === 2 ? "sm:border-l" : ""}`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#8c3b1e] shadow-sm sm:h-12 sm:w-12">
                <Icon size={22} strokeWidth={1.7} />
              </span>
              <div className="min-w-0">
                <h3 className="text-xs font-bold leading-5 text-stone-900 sm:text-sm">
                  {item.title}
                </h3>
                <p className="mt-0.5 text-[10px] leading-4 text-stone-500 sm:text-xs">
                  {item.text}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

export default function Home() {
  const [media, setMedia] = useState({
    category: [],
    dish: [],
    product: [],
    recipe: [],
    banner: [],
  });

  const recipeTrack = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const sections = ["category", "dish", "product", "recipe", "banner"];

    async function loadMedia() {
      const results = await Promise.all(
        sections.map(async (section) => {
          try {
            const response = await api.get(`/media?section=${section}`);

            const items = Array.isArray(response.data)
              ? response.data
              : response.data?.items ?? response.data?.media ?? [];

            return [
              section,
              items.filter(
                (item) => item.is_active === true && item.image_url
              ),
            ];
          } catch (error) {
            console.error(`Failed to load ${section} media:`, error);
            return [section, []];
          }
        })
      );

      if (!cancelled) {
        setMedia(Object.fromEntries(results));
      }
    }

    loadMedia();

    return () => {
      cancelled = true;
    };
  }, []);

  const categoryImages = media.category;
  const dishImages = media.dish;
  const productImages = media.product;
  const recipeImages = media.recipe;
  const bannerImages = media.banner;

  const storyImage =
    bannerImages.find((image) =>
      mediaMatches(image, ["story", "about", "spice-to-plate", "brand-story"])
    ) || bannerImages[0];

  const ctaImage =
    bannerImages.find((image) =>
      mediaMatches(image, ["home-cta", "cta", "home-banner", "final-banner"])
    ) || bannerImages[1] || bannerImages[0];

  const scrollRecipes = (direction) => {
    if (!recipeTrack.current) return;

    recipeTrack.current.scrollBy({
      left: direction * recipeTrack.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  return (
    <main className="w-full overflow-hidden bg-[#fffaf3] text-stone-900">
      {/* HERO */}
      <HeroCarousel />

      <TrustStrip />

      {/* SHOP BY CATEGORY */}
      <section className="px-4 pb-12 pt-14 sm:px-6 sm:pb-16 sm:pt-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            eyebrow="Explore our collection"
            title="Shop by Category"
            description="Find the right flavours for every recipe in your kitchen."
            action="View All Categories"
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6"
          >
            {categoryImages.map((image, index) => {
              const item =
                categories.find((category) =>
                  mediaMatches(image, [category.name])
                ) || {
                  name: getMediaTitle(image),
                  count: 0,
                };

              return (
                <motion.article
                  variants={fadeUp}
                  key={image.id ?? image.image_url ?? index}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="group min-w-0 overflow-hidden rounded-2xl border border-[#eee1d3] bg-white shadow-[0_3px_12px_rgba(65,39,21,0.04)] transition-shadow duration-300 hover:shadow-xl"
                >
                  <Link to="/shop" className="block">
                    <div className="relative h-28 overflow-hidden bg-[#eadbca] sm:h-32 lg:h-24 xl:h-28">
                      <img
                        src={image.image_url}
                        alt={image.alt_text || item.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                    </div>
                    <div className="p-3">
                      <h3 className="line-clamp-2 min-h-9 text-xs font-bold leading-5 text-stone-900 transition-colors group-hover:text-[#a14e29] sm:text-sm">
                        {item.name}
                      </h3>
                      <div className="mt-2 flex items-center justify-between gap-1">
                        <span className="text-[10px] text-stone-500">
                          {item.count ? `${item.count} Products` : "Explore Collection"}
                        </span>
                        <ArrowRight
                          size={14}
                          className="shrink-0 text-[#8c3b1e] transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* SHOP BY DISH */}
      <section className="relative overflow-hidden bg-[#f2e5d5] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#e2c6a8]/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#e6c9a9]/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <SectionTitle
            eyebrow="Made for your kitchen"
            title="Cook Something Special"
            description="Find the perfect spices for the dishes you love."
            action="Explore All Spices"
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-6"
          >
            {(dishImages.length
              ? dishImages.map((image, index) => {
                  const matched = dishes.find((dish) =>
                    mediaMatches(image, [dish.name])
                  );

                  return {
                    ...matched,
                    name: matched?.name || getMediaTitle(image),
                    image: image.image_url,
                    description: matched?.description || image.alt_text || "Made for your kitchen",
                    number: matched?.number || String(index + 1).padStart(2, "0"),
                    mediaId: image.id,
                  };
                })
              : dishes
            ).map((dish, index) => (
              <motion.article
                variants={fadeUp}
                key={dish.mediaId ?? dish.name}
                whileHover={{ y: -7 }}
                className="group relative isolate h-52 overflow-hidden rounded-2xl bg-[#3c2417] shadow-[0_8px_24px_rgba(59,33,19,0.16)] ring-1 ring-black/5 sm:h-60 lg:h-[270px]"
              >
                <Link
                  to="/shop"
                  aria-label={`Shop spices for ${dish.name}`}
                  className="absolute inset-0 block"
                >
                  <ImageWithFallback
                    src={dish.image}
                    fallback="/images/dish-placeholder.jpg"
                    alt={dish.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10 transition-colors duration-300 group-hover:via-black/55" />

                  <div className="absolute left-3 right-3 top-3 flex items-center justify-between sm:left-4 sm:right-4 sm:top-4">
                    <span className="rounded-full border border-white/40 bg-black/60 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm sm:text-[10px]">
                      SpiceCraft
                    </span>
                    <span className="text-xs font-bold text-white drop-shadow-md">
                      {dish.number || String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                    <span className="mb-2 inline-flex max-w-full rounded-md bg-[#fff3df] px-2 py-1 text-[9px] font-bold leading-tight text-stone-900 shadow-sm sm:text-[10px]">
                      {dish.description}
                    </span>
                    <h3 className="break-words text-lg font-extrabold leading-tight tracking-wide text-white drop-shadow-[0_3px_5px_rgba(0,0,0,0.9)] sm:text-xl">
                      {dish.name}
                    </h3>
                    <div className="mt-3 flex items-center justify-between border-t border-white/40 pt-2.5">
                      <span className="text-[10px] font-bold text-white sm:text-xs">
                        Find spices
                      </span>
                      <motion.span
                        whileHover={{ rotate: -35, scale: 1.08 }}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fff3df] text-stone-900 transition-colors duration-300 group-hover:bg-[#d6a36e] sm:h-8 sm:w-8"
                      >
                        <ArrowRight size={15} />
                      </motion.span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            eyebrow="Customer favourites"
            title="Best Sellers"
            description="Our most-loved spice blends, selected for authentic flavour."
            action="View All Spices"
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-2 items-stretch gap-3 sm:gap-5 lg:grid-cols-4"
          >
            {(productImages.length
              ? productImages.map((image, index) => {
                  const matched = products.find((product) =>
                    mediaMatches(image, [product.name])
                  );

                  return {
                    ...matched,
                    id: matched?.id ?? image.id ?? `media-product-${index}`,
                    name: matched?.name || getMediaTitle(image),
                    price: matched?.price,
                    spiceLevel: matched?.spiceLevel ?? 2,
                    image: image.image_url,
                    mediaId: image.id,
                  };
                })
              : products
            ).map((product) => (
              <motion.article
                variants={fadeUp}
                key={product.mediaId ?? product.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25 }}
                className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#eadfd3] bg-white shadow-sm transition-all duration-300 hover:border-[#c9a47c] hover:shadow-xl"
              >
                <Link
                  to={product.id <= 4 ? `/product/${product.id}` : "/shop"}
                  className="relative block h-36 shrink-0 overflow-hidden bg-[#efe3d5] sm:h-52 lg:h-48"
                >
                  <ImageWithFallback
                    src={product.image}
                    fallback="/images/product-biryani-masala.jpg"
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <span className="absolute left-2 top-2 rounded-full bg-[#fff9f0]/95 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#8c3b1e] sm:left-3 sm:top-3 sm:px-2.5">
                    SpiceCraft
                  </span>
                  <span className="absolute bottom-2 right-2 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[#8c3b1e] shadow-sm">
                    Best Seller
                  </span>
                </Link>

                <div className="flex flex-1 flex-col p-3 sm:p-4">
                  <div className="mb-2 flex items-center justify-between gap-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-stone-500 sm:text-[10px]">
                      Spice level
                    </span>
                    <div
                      className="flex shrink-0 gap-0.5 sm:gap-1"
                      aria-label={`Spice level ${product.spiceLevel} out of 5`}
                    >
                      {[1, 2, 3, 4, 5].map((level) => (
                        <motion.span
                          key={level}
                          initial={{ scale: 0.6, opacity: 0.4 }}
                          whileInView={{ scale: 1, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: level * 0.04 }}
                          className={`h-1.5 w-2 rounded-full sm:w-2.5 ${
                            level <= product.spiceLevel ? "bg-red-700" : "bg-stone-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <h3 className="min-h-10 text-sm font-bold leading-5 text-stone-900 sm:min-h-12 sm:text-base">
                    {product.name}
                  </h3>
                  <p className="mt-1.5 min-h-8 text-[10px] leading-4 text-stone-500 sm:text-xs sm:leading-5">
                    Crafted for rich, authentic flavour.
                  </p>
                  <div className="mt-auto flex items-center justify-between gap-2 border-t border-[#eee4dd] pt-3">
                    <span className="text-base font-extrabold text-stone-900 sm:text-xl">
                      {product.price != null ? `₹${product.price}` : "Explore"}
                    </span>
                    <Link
                      to={product.id <= 4 ? `/product/${product.id}` : "/shop"}
                      className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[#783b25] px-2.5 py-2 text-[10px] font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4d2518] sm:px-3 sm:text-xs"
                    >
                      View <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-8 flex justify-center"
          >
            <Link
              to="/shop"
              className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#783b25] px-6 py-3 text-sm font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-[#4d2518] hover:shadow-lg"
            >
              Explore All Products
              <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* RECIPE CAROUSEL */}
      <section className="bg-[#f3e8da] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex items-end justify-between gap-4"
          >
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8c3b1e] sm:text-xs">
                From our kitchen
              </p>
              <h2 className="font-serif text-2xl font-bold text-stone-900 sm:text-3xl lg:text-4xl">
                Popular <span className="text-[#8c3b1e]">Recipes</span>
              </h2>
              <p className="mt-2 text-sm text-stone-600">
                Everyday inspiration for something delicious.
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => scrollRecipes(-1)}
                aria-label="Previous recipes"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dfc9b3] bg-white text-[#8c3b1e] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#704226] hover:text-white"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollRecipes(1)}
                aria-label="Next recipes"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dfc9b3] bg-white text-[#8c3b1e] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#704226] hover:text-white"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>

          <div
            ref={recipeTrack}
            className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {(recipeImages.length
              ? recipeImages.map((image, index) => {
                  const matched = recipes.find((recipe) =>
                    mediaMatches(image, [recipe.name])
                  );

                  return {
                    ...matched,
                    name: matched?.name || getMediaTitle(image),
                    time: matched?.time || "See recipe",
                    type: matched?.type || "RECIPE",
                    image: image.image_url,
                    mediaId: image.id ?? index,
                  };
                })
              : recipes
            ).map((recipe, index) => (
              <motion.div
                key={recipe.mediaId ?? recipe.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
                className="min-w-[78%] snap-start sm:min-w-[45%] lg:min-w-[calc(25%-12px)]"
              >
                <Link
                  to="/recipes"
                  className="group relative block h-52 overflow-hidden rounded-2xl bg-[#472818] shadow-sm"
                >
                  <ImageWithFallback
                    src={recipe.image}
                    fallback="/images/dish-placeholder.jpg"
                    alt={recipe.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full bg-[#fff8ed] px-3 py-1 text-[9px] font-bold text-stone-900">
                    {recipe.type}
                  </span>
                  <div className="absolute inset-x-4 bottom-4">
                    <span className="mb-1 flex items-center gap-1 text-[10px] text-white/90">
                      <Clock size={12} /> {recipe.time}
                    </span>
                    <h3 className="text-lg font-bold text-white drop-shadow-md">
                      {recipe.name}
                    </h3>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-amber-200">
                      View Recipe
                      <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65 }}
            className="group relative min-h-[300px] overflow-hidden rounded-2xl bg-[#d9c9be] sm:min-h-[440px]"
          >
            <ImageWithFallback
              src={storyImage?.image_url || "/images/spice-to-plate.jpg"}
              fallback="/images/story-placeholder.jpg"
              alt={storyImage?.alt_text || "Indian spices and traditional cooking ingredients"}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">
                SpiceCraft tradition
              </p>
              <h3 className="mt-2 font-serif text-3xl font-bold text-white sm:text-4xl">
                From Spice to Plate
              </h3>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65 }}
            className="py-2 lg:py-8"
          >
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8c3b1e] sm:text-xs">
              Our promise
            </p>
            <h2 className="font-serif text-3xl font-bold leading-tight text-stone-900 sm:text-4xl lg:text-5xl">
              A little spice.{" "}
              <span className="text-[#8c3b1e]">A lot of soul.</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-stone-600 sm:text-base">
              We believe the right spices can turn everyday cooking into
              memorable meals. SpiceCraft brings together familiar Indian
              flavours and thoughtfully crafted blends for your kitchen.
            </p>

            <div className="mt-7 space-y-5">
              {storySteps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.12 }}
                  className="flex gap-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#ddc8b4] bg-[#f6ebdf] text-xs font-bold text-[#8c3b1e]">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 sm:text-base">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-stone-500 sm:text-sm">
                      {step.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link
              to="/about"
              className="group mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#8c3b1e] transition-colors hover:text-[#b45b2c]"
            >
              Discover Our Story
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* WHY SPICECRAFT */}
      <section className="border-y border-[#eee0ce] bg-[#fffdf8] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto mb-8 max-w-xl text-center"
          >
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8c3b1e] sm:text-xs">
              The SpiceCraft difference
            </p>
            <h2 className="font-serif text-2xl font-bold text-stone-900 sm:text-3xl lg:text-4xl">
              Good Food Starts with Good Spices
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              { title: "Carefully Selected", text: "Ingredients chosen with care.", icon: Leaf },
              { title: "Full of Flavour", text: "Blends made for rich aroma.", icon: Flame },
              { title: "Quality Focused", text: "Consistency in every pack.", icon: CheckCircle2 },
              { title: "Shopping Made Easy", text: "A smooth, simple experience.", icon: ShieldCheck },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <motion.article
                  variants={fadeUp}
                  key={item.title}
                  whileHover={{ y: -5 }}
                  className="flex items-start gap-3 rounded-xl border border-[#eee1d3] bg-[#fffaf3] p-4 transition-all duration-300 hover:border-[#d6b99d] hover:shadow-md"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#efe0cf] text-[#8c3b1e]">
                    <Icon size={19} />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-stone-500">
                      {item.text}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative isolate overflow-hidden bg-[#281309]">
        <ImageWithFallback
          src={ctaImage?.image_url || "/images/home-cta.jpg"}
          fallback="/images/story-placeholder.jpg"
          alt={ctaImage?.alt_text || "Traditional Indian spices"}
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1c0b05]/95 via-[#281309]/90 to-[#482719]/65" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65 }}
            className="max-w-2xl"
          >
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-amber-300 sm:text-xs">
              <Sparkles size={14} className="mr-2 inline" />
              Bring home authentic flavour
            </p>
            <h2 className="!text-white text-4xl font-bold leading-tight md:text-5xl">
              Make every meal a little more memorable.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-white/80 sm:text-base">
              Discover authentic Indian spice blends and bring more flavour
              to every meal you share.
            </p>
            <Link
              to="/shop"
              className="group mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#f0c18d] hover:bg-[#fed7aa] px-6 py-3 text-sm font-extrabold text-stone-950 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#f0c18d] hover:shadow-xl"
            >
              Shop Our Collection
              <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}