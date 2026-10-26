
import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Leaf,
  Flame,
  ChefHat,
  Sprout,
  Heart,
  Award,
} from "lucide-react";

const About = () => {
  const processSteps = [
    {
      number: "01",
      icon: Sprout,
      title: "Ingredient Selection",
      description:
        "Great masala begins with carefully selected ingredients chosen for their aroma, flavour and quality.",
    },
    {
      number: "02",
      icon: Flame,
      title: "Roasting & Grinding",
      description:
        "Carefully balanced roasting and grinding help bring out the natural aroma and character of Indian spices.",
    },
    {
      number: "03",
      icon: ChefHat,
      title: "Made for Modern Kitchens",
      description:
        "Authentic Indian flavours made simple for everyday cooking, from quick meals to traditional recipes.",
    },
  ];

  const values = [
    {
      icon: Leaf,
      title: "Authentic Flavours",
      description:
        "Inspired by India's diverse culinary traditions and regional spice combinations.",
    },
    {
      icon: Heart,
      title: "Made for Everyday Cooking",
      description:
        "Helping home cooks prepare flavourful meals with greater convenience.",
    },
    {
      icon: Award,
      title: "Quality Matters",
      description:
        "A thoughtful approach to ingredient selection, flavour balance and consistency.",
    },
  ];

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

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#1c1009]/95 via-[#302016]/85 to-[#382216]/60" />

        <div className="mx-auto grid min-h-[440px] max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:px-12">

          <div className="max-w-2xl">

            <span className="inline-flex items-center rounded-full border border-[#ffda8a]/40 bg-black/25 px-4 py-2 text-xs font-bold tracking-[0.2em] !text-[#ffda8a] backdrop-blur-sm">
              OUR STORY
            </span>

            <h1 className="mt-6 font-serif text-4xl font-extrabold leading-tight !text-[#fffaf2] sm:text-5xl lg:text-6xl">
              <span className="!text-[#fffaf2]">
                Preserving India's
              </span>
              <br />
              <span className="italic !text-[#ffda8a]">
                Spice Heritage.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 !text-[#fffaf2] sm:text-base sm:leading-8">
              SpiceCraft brings traditional Indian spice wisdom
              together with modern convenience, helping every kitchen
              create authentic and memorable meals.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <Link
                to="/shop"
                className="inline-flex min-h-12 items-center gap-3 rounded-lg bg-[#f4cb83] px-6 py-3 text-sm font-extrabold !text-stone-950 hover:bg-[#fed7aa] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#ffe0a6]"
              >
                Explore Our Spices
                <ArrowRight size={17} />
              </Link>

              <a
                href="#our-story"
                className="inline-flex min-h-12 items-center rounded-lg border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold !text-[#fffaf2] transition hover:bg-white/20"
              >
                Discover Our Story
              </a>

            </div>
          </div>

          <div className="hidden justify-end lg:flex">
            <div className="max-w-xs rounded-2xl border border-white/25 bg-[#211309]/70 p-7 shadow-2xl backdrop-blur-md">

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#f4cb83]/15">
                <Leaf size={30} className="text-[#ffda8a]" />
              </div>

              <p className="mt-6 font-serif text-2xl font-bold leading-snug !text-[#fffaf2]">
                Rooted in tradition.
                <br />
                Made for today.
              </p>

              <p className="mt-4 text-sm leading-7 !text-[#f3e5d8]">
                Bringing the warmth, aroma and character of Indian
                spices into everyday kitchens.
              </p>

              <div className="mt-6 h-1 w-16 rounded-full bg-[#ffda8a]" />

            </div>
          </div>

        </div>
      </section>

      {/* OUR STORY SECTION */}
      <section
        id="our-story"
        className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">

          <div className="relative">

            <div className="absolute -left-3 -top-3 h-28 w-28 rounded-tl-3xl border-l-2 border-t-2 border-[#d5a66b] sm:-left-5 sm:-top-5" />

            <div className="relative overflow-hidden rounded-3xl bg-[#eadbca] shadow-xl">
              <img
                src="/images/about-story.jpg"
                alt="Authentic Indian spices prepared for cooking"
                loading="lazy"
                className="h-[320px] w-full object-cover sm:h-[430px]"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src =
                    "/images/hero-spices-2.jpg";
                }}
              />
            </div>

            <div className="absolute -bottom-5 right-4 max-w-[230px] rounded-2xl border border-[#ead7bf] bg-white p-4 shadow-lg sm:right-8 sm:p-5">
              <p className="font-serif text-lg font-bold text-[#6e3d23]">
                The heart of Indian cooking
              </p>
              <p className="mt-1 text-xs leading-5 text-stone-600">
                Tradition, aroma and flavour in every meal.
              </p>
            </div>

          </div>

          <div className="pt-5 lg:pt-0">

            <span className="text-xs font-extrabold tracking-[0.22em] text-[#9b552f]">
              WHY SPICECRAFT
            </span>

            <h2 className="mt-4 font-serif text-3xl font-bold leading-tight text-stone-900 sm:text-4xl lg:text-5xl">
              From traditional spice knowledge
              <span className="mt-1 block text-[#8c3b1e]">
                to modern kitchens.
              </span>
            </h2>

            <p className="mt-6 text-sm leading-7 text-stone-700 sm:text-base sm:leading-8">
              Indian cooking has always been deeply connected to
              spices. Every region has its own flavours, techniques
              and traditions.
            </p>

            <p className="mt-4 text-sm leading-7 text-stone-700 sm:text-base sm:leading-8">
              At SpiceCraft, we bring these flavours together in
              carefully selected spice blends designed for everyday
              cooking.
            </p>

            <div className="mt-7 space-y-4">

              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e9d4b8]">
                  <Leaf size={14} className="text-[#8c3b1e]" />
                </span>
                <p className="text-sm leading-6 text-stone-700">
                  Inspired by authentic Indian food traditions.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e9d4b8]">
                  <ChefHat size={14} className="text-[#8c3b1e]" />
                </span>
                <p className="text-sm leading-6 text-stone-700">
                  Designed to make everyday cooking more convenient.
                </p>
              </div>

            </div>

<Link
  to="/shop"
  className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#382216] px-6 py-3.5 text-sm font-bold !text-[#fffaf2] transition hover:bg-[#603b27]"
>
  Explore Our Collection
  <ArrowRight size={17} />
</Link>
          </div>
        </div>
      </section>

      {/* BRAND VALUES */}
      <section className="border-y border-[#eee0d0] bg-[#f7efe5] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">

        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-2xl text-center">

            <span className="text-xs font-extrabold tracking-[0.22em] text-[#9b552f]">
              WHAT WE BELIEVE
            </span>

            <h2 className="mt-4 font-serif text-3xl font-bold text-stone-900 sm:text-4xl">
              More than just spices.
            </h2>

            <p className="mt-4 text-sm leading-7 text-stone-700 sm:text-base">
              The little details that make cooking meaningful,
              memorable and full of flavour.
            </p>

          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">

            {values.map((value) => {
              const Icon = value.icon;

              return (
                <article
                  key={value.title}
                  className="rounded-2xl border border-[#e8d8c5] bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-8"
                >

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5e5ce]">
                    <Icon size={27} className="text-[#8c3b1e]" />
                  </div>

                  <h3 className="mt-6 font-serif text-xl font-bold text-stone-900">
                    {value.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-stone-700">
                    {value.description}
                  </p>

                </article>
              );
            })}

          </div>
        </div>
      </section>

      {/* OUR PROCESS */}
      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">

        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-3xl text-center">

            <span className="text-xs font-extrabold tracking-[0.22em] text-[#9b552f]">
              OUR PROCESS
            </span>

            <h2 className="mt-4 font-serif text-3xl font-bold leading-tight text-stone-900 sm:text-4xl">
              From carefully selected ingredients
              <span className="block text-[#8c3b1e]">
                to your kitchen.
              </span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-stone-700 sm:text-base">
              Every SpiceCraft product follows a thoughtful process
              focused on flavour, freshness and consistency.
            </p>

          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">

            {processSteps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="group relative overflow-hidden rounded-2xl border border-[#eadbca] bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#d5b28c] hover:shadow-xl sm:p-8"
                >

                  <div className="flex items-center justify-between">

                    <span className="font-serif text-4xl font-bold text-[#e8d7c4] transition group-hover:text-[#d5ad7c]">
                      {step.number}
                    </span>

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f5e5ce]">
                      <Icon size={24} className="text-[#8c3b1e]" />
                    </div>

                  </div>

                  <h3 className="mt-7 font-serif text-xl font-bold text-stone-900">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-stone-700">
                    {step.description}
                  </p>

                  <div className="mt-6 h-1 w-12 rounded-full bg-[#d5ad7c] transition-all group-hover:w-20" />

                </article>
              );
            })}

          </div>
        </div>
      </section>

      {/* MISSION SECTION */}
      <section className="relative isolate overflow-hidden bg-[#382216] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">

        <div className="absolute -left-20 -top-20 -z-10 h-72 w-72 rounded-full bg-[#d5ad7c]/15 blur-3xl" />

        <div className="absolute -bottom-28 right-0 -z-10 h-80 w-80 rounded-full bg-[#9b552f]/20 blur-3xl" />

        <div className="mx-auto max-w-4xl text-center">

          <span className="inline-flex rounded-full border border-[#ffda8a]/30 bg-white/5 px-4 py-2 text-xs font-bold tracking-[0.2em] text-[#ffda8a]">
            OUR MISSION
          </span>

          <h2 className="mt-6 font-serif text-3xl font-extrabold leading-tight !text-[#fffaf2] sm:text-4xl lg:text-5xl">
            Make authentic Indian cooking easier,
            <span className="mt-2 block !text-[#ffda8a]">
              one spice at a time.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 !text-[#f3e5d8] sm:text-base sm:leading-8">
            We want to make quality Indian spices accessible to modern
            home cooks while respecting the traditions behind every blend.
          </p>

          <div className="mx-auto mt-8 h-1 w-16 rounded-full bg-[#ffda8a]" />

        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">

        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#f0dfc9]">

          <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#d6a16b]/25 blur-3xl" />

          <div className="relative px-6 py-12 text-center sm:px-12 sm:py-16 lg:px-20 lg:py-20">

            <span className="text-xs font-extrabold tracking-[0.22em] text-[#8c3b1e]">
              BRING FLAVOUR HOME
            </span>

            <h2 className="mx-auto mt-5 max-w-3xl font-serif text-3xl font-bold leading-tight text-stone-900 sm:text-4xl lg:text-5xl">
              Your next memorable meal
              <span className="mt-2 block text-[#8c3b1e]">
                starts with the right spice.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-stone-700 sm:text-base">
              Discover spice blends inspired by India's rich food
              traditions and find a little inspiration for your next meal.
            </p>

<Link
  to="/shop"
  className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-lg bg-[#8c3b1e] px-7 py-3.5 text-sm font-bold !text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#722f18]"
>
  Shop SpiceCraft
  <ArrowRight size={17} />
</Link>

          </div>
        </div>
      </section>

    </main>
  );
};

export default About;
