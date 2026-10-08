import React from "react";
import { Link, useParams } from "react-router-dom";
import "./BlogDetails.css";

const posts = [
  {
    id: 1,
    title: "How to Choose the Right Spice for Every Dish",
    category: "SPICE GUIDE",
    date: "08 Oct 2026",
    readTime: "5 min read",
    image: "/images/blog-spice-guide.jpg",
    intro:
      "Indian cooking is all about balance. The right spice can transform a simple dish into something aromatic, rich and memorable.",
    sections: [
      {
        heading: "Understand the Role of Each Spice",
        text:
          "Turmeric brings colour and earthy notes, chilli adds heat and vibrancy, coriander gives a fresh citrus-like character, while cumin adds warmth and depth.",
      },
      {
        heading: "Match the Spice to the Dish",
        text:
          "Choose spices based on the flavour you want to build. Biryani benefits from aromatic blends, sambar needs earthy and balanced spices, while pepper works beautifully with savoury dishes.",
      },
      {
        heading: "Freshness Matters",
        text:
          "Freshly packed spices retain their aroma and flavour better. Store them away from direct sunlight, moisture and excessive heat.",
      },
    ],
  },
  {
    id: 2,
    title: "The Story Behind Authentic Indian Masala Blends",
    category: "OUR SPICES",
    date: "05 Oct 2026",
    readTime: "6 min read",
    image: "/images/blog-masala-blends.jpg",
    intro:
      "A great masala is more than a list of spices. It is about selecting, balancing and blending each ingredient carefully.",
    sections: [
      {
        heading: "Selecting the Spices",
        text:
          "Quality ingredients are the foundation of a balanced masala. Each spice contributes its own aroma, flavour and character.",
      },
      {
        heading: "Creating the Balance",
        text:
          "The art of blending is about bringing individual flavours together without allowing one ingredient to overpower the others.",
      },
      {
        heading: "From Blend to Kitchen",
        text:
          "A carefully prepared masala makes everyday cooking easier while helping home cooks create consistent flavour.",
      },
    ],
  },
  {
    id: 3,
    title: "5 Simple Ways to Make Everyday Cooking Better",
    category: "COOKING TIPS",
    date: "02 Oct 2026",
    readTime: "4 min read",
    image: "/images/blog-cooking-tips.jpg",
    intro:
      "You don't need complicated techniques to make everyday meals more flavourful. A few simple habits can make a big difference.",
    sections: [
      {
        heading: "Toast Whole Spices",
        text:
          "Lightly toasting whole spices can release their natural aroma and add extra depth to your dishes.",
      },
      {
        heading: "Use Spices at the Right Time",
        text:
          "Adding spices at different stages of cooking can create layers of flavour instead of a flat taste.",
      },
      {
        heading: "Keep Your Spice Shelf Fresh",
        text:
          "Store spices in clean, airtight containers and avoid keeping them near heat or steam.",
      },
    ],
  },
  {
    id: 4,
    title: "How to Store Spices for Better Freshness",
    category: "KITCHEN TIPS",
    date: "28 Sep 2026",
    readTime: "4 min read",
    image: "/images/blog-storage.jpg",
    intro:
      "Proper storage helps preserve the aroma, colour and flavour of your favourite spices for longer.",
    sections: [
      {
        heading: "Keep Spices Away from Moisture",
        text:
          "Always use a dry spoon and close containers properly after every use.",
      },
      {
        heading: "Avoid Direct Sunlight",
        text:
          "Store spices in a cool, dry cupboard away from direct sunlight and excessive heat.",
      },
      {
        heading: "Buy What You Use",
        text:
          "Smaller quantities that are used regularly can help you enjoy spices while they are still aromatic and fresh.",
      },
    ],
  },
];

const BlogDetails = () => {
  const { id } = useParams();

  const post = posts.find((item) => item.id === Number(id));

  if (!post) {
    return (
      <main className="blog-details-not-found">
        <span>SPICECRAFT</span>
        <h1>Article Not Found</h1>
        <p>We couldn't find the article you're looking for.</p>
        <Link to="/blog">Back to Blog</Link>
      </main>
    );
  }

  return (
    <main className="blog-details-page">

      <div className="blog-details-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/blog">Blog</Link>
        <span>/</span>
        <span>{post.title}</span>
      </div>

      <article className="blog-article">

        <header className="blog-article-header">
          <span>{post.category}</span>

          <h1>{post.title}</h1>

          <div className="blog-article-meta">
            <span>{post.date}</span>
            <span>{post.readTime}</span>
          </div>
        </header>

        <div className="blog-article-image">
          <img
            src={post.image}
            alt={post.title}
            onError={(e) => {
              e.currentTarget.src = "/images/product-placeholder.jpg";
            }}
          />
        </div>

        <div className="blog-article-content">

          <p className="blog-article-intro">
            {post.intro}
          </p>

          {post.sections.map((section, index) => (
            <section key={index}>
              <h2>{section.heading}</h2>
              <p>{section.text}</p>
            </section>
          ))}

        </div>

      </article>

      <section className="blog-article-bottom">
        <h2>Explore More from SpiceCraft</h2>
        <p>
          Discover authentic spices and bring more flavour to your kitchen.
        </p>

        <div>
          <Link to="/recipes">Explore Recipes</Link>
          <Link to="/shop">Shop Spices</Link>
        </div>
      </section>

    </main>
  );
};

export default BlogDetails;