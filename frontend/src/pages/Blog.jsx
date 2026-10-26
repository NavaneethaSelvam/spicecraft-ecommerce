
import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock,
  Sparkles,
  ChefHat,
} from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "How to Choose the Right Spice for Every Dish",
    category: "SPICE GUIDE",
    date: "08 Oct 2026",
    readTime: "5 min read",
    image: "/images/blog-spice-guide.jpg",
    excerpt:
      "Learn how different Indian spices bring colour, aroma and depth to everyday cooking.",
  },
  {
    id: 2,
    title: "The Story Behind Authentic Indian Masala Blends",
    category: "OUR SPICES",
    date: "05 Oct 2026",
    readTime: "6 min read",
    image: "/images/blog-masala-blends.jpg",
    excerpt:
      "Discover how carefully selected spices come together to create balanced masala blends.",
  },
  {
    id: 3,
    title: "5 Simple Ways to Make Everyday Cooking Better",
    category: "COOKING TIPS",
    date: "02 Oct 2026",
    readTime: "4 min read",
    image: "/images/blog-cooking-tips.jpg",
    excerpt:
      "Small changes in preparation and spice selection can make a big difference to your meals.",
  },
  {
    id: 4,
    title: "How to Store Spices for Better Freshness",
    category: "KITCHEN TIPS",
    date: "28 Sep 2026",
    readTime: "4 min read",
    image: "/images/blog-storage.jpg",
    excerpt:
      "Simple storage habits that help preserve the aroma and quality of your spices.",
  },
];

function Blog() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fffaf3] text-stone-900">

      {/* HERO SECTION */}
      <section className="relative isolate overflow-hidden bg-[#302016]">

        <img
          src="/images/hero-spices-2.jpg"
          alt="Traditional Indian spices"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#1b1009]/95 via-[#302016]/85 to-[#382216]/55" />

        <div className="mx-auto grid min-h-[420px] max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:px-12">

          <div className="max-w-2xl">

            <span className="inline-flex items-center gap-2 rounded-full border border-[#f4cb83]/40 bg-black/25 px-4 py-2 text-[10px] font-bold tracking-[0.2em] text-[#ffdfa5] backdrop-blur-sm sm:text-xs">
              <Sparkles size={15} />
              THE SPICECRAFT JOURNAL
            </span>
<h1 className="mt-6 font-serif text-4xl font-extrabold leading-tight !text-[#fffaf2] sm:text-5xl lg:text-6xl">
  <span className="!text-[#fffaf2]">
    Stories, Spice
  </span>
  <br />
  <span className="italic !text-[#ffda8a]">
    &amp; Everyday Cooking
  </span>
</h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-[#fffaf2] sm:text-base sm:leading-8">
              Explore spice guides, cooking inspiration and stories
              from the world of authentic Indian flavours.
            </p>

            <a
              href="#latest-stories"
              className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-lg bg-[#f4cb83] px-6 py-3 text-sm font-bold text-stone-950 font-bold shadow-md transition hover:-translate-y-0.5 hover:bg-[#ffe0a6]"
            >
              Explore Stories
              <ArrowRight size={17} />
            </a>

          </div>

          <div className="hidden justify-end lg:flex">
            <div className="max-w-xs rounded-2xl border border-white/25 bg-[#211309]/65 p-7 shadow-xl backdrop-blur-md">

              <BookOpen size={30} className="text-[#ffda8a]" />

              <p className="mt-5 font-serif text-2xl font-semibold leading-snug text-[#fffaf2]">
                A little knowledge.
                <br />
                A lot of flavour.
              </p>

              <p className="mt-3 text-sm leading-6 text-[#f6e9dc]">
                Simple ideas to inspire your next delicious meal.
              </p>

              <div className="mt-6 h-1 w-14 rounded-full bg-[#f4cb83]" />

            </div>
          </div>

        </div>
      </section>

      {/* LATEST STORIES */}
      <section
        id="latest-stories"
        className="scroll-mt-20 px-4 py-14 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">

          <div className="mb-9 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <span className="text-[10px] font-extrabold tracking-[0.22em] text-[#8c3b1e] sm:text-xs">
                FROM OUR JOURNAL
              </span>

              <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                Latest Stories
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-stone-700 sm:text-base">
                Helpful ideas and inspiration to make your everyday
                cooking more flavourful.
              </p>

            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#e5d3bf] bg-white px-4 py-2 text-xs font-semibold text-[#684027] shadow-sm">
              <ChefHat size={16} />
              Inspiration from our kitchen
            </div>

          </div>

          {/* BLOG CARDS */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#eadbca] bg-white shadow-[0_4px_18px_rgba(65,39,21,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#d4ae86] hover:shadow-xl"
              >

                <Link
                  to={`/blog/${post.id}`}
                  aria-label={`Read ${post.title}`}
                  className="relative block h-56 overflow-hidden bg-[#eadbca]"
                >

                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src =
                        "/images/product-placeholder.jpg";
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  <span className="absolute left-4 top-4 rounded-full border border-white/50 bg-[#fffaf3] px-3 py-1.5 text-[9px] font-extrabold tracking-[0.12em] text-stone-900 shadow-sm">
                    {post.category}
                  </span>

                </Link>

                <div className="flex flex-1 flex-col p-5">

                  <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-medium text-stone-600">

                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays size={13} />
                      {post.date}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={13} />
                      {post.readTime}
                    </span>

                  </div>

                  <Link
                    to={`/blog/${post.id}`}
                    className="font-serif text-xl font-bold leading-snug text-stone-900 transition-colors group-hover:text-[#8c3b1e]"
                  >
                    {post.title}
                  </Link>

                  <p className="mt-3 flex-1 text-sm leading-6 text-stone-700">
                    {post.excerpt}
                  </p>

                  <div className="mt-5 border-t border-[#eadfd3] pt-4">

                    <Link
                      to={`/blog/${post.id}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-[#8c3b1e] transition-all group-hover:gap-3 group-hover:text-[#b65327]"
                    >
                      Read Article
                      <ArrowRight size={16} />
                    </Link>

                  </div>

                </div>

              </article>
            ))}

          </div>
        </div>
      </section>

      {/* NEWSLETTER CTA */}
      <section className="px-4 pb-14 sm:px-6 sm:pb-20 lg:px-8">

        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#302016]">

          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#e8bd78]/20 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-[#d17b3f]/15 blur-3xl" />

          <div className="relative grid items-center gap-8 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[1fr_0.9fr] lg:gap-12 lg:px-16">

            <div>

              <span className="inline-flex items-center gap-2 text-[10px] font-extrabold tracking-[0.22em] text-[#ffda8a] sm:text-xs">
                <Sparkles size={15} />
                STAY IN THE LOOP
              </span>

<h2 className="mt-4 max-w-xl font-serif text-3xl font-extrabold leading-tight !text-[#fffaf2] sm:text-4xl">
  <span className="!text-[#fffaf2]">
    Bring More Flavour
  </span>
  <br className="hidden sm:block" />
  <span className="!text-[#ffda8a]">
    to Your Inbox
  </span>
</h2>

              <p className="mt-4 max-w-lg text-sm leading-7 text-[#f3e5d8] sm:text-base">
                Get cooking inspiration, spice tips and the latest
                SpiceCraft updates.
              </p>

            </div>

            <form
              className="flex w-full flex-col gap-3 sm:flex-row"
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >

              <label htmlFor="blog-email" className="sr-only">
                Email address
              </label>

              <input
                id="blog-email"
                type="email"
                placeholder="Enter your email address"
                required
                className="min-h-12 min-w-0 flex-1 rounded-lg border border-white/30 bg-white/10 px-4 text-sm text-white outline-none placeholder:text-[#e7d8ca] transition focus:border-[#ffda8a] focus:ring-2 focus:ring-[#ffda8a]/40"
              />

              <button
                type="submit"
                className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#f4cb83] px-5 py-3 text-sm font-extrabold text-stone-950 font-bold transition hover:bg-[#ffe0a6]"
              >
                Subscribe
                <ArrowRight size={16} />
              </button>

            </form>

          </div>
        </div>
      </section>

    </main>
  );
}

export default Blog;
