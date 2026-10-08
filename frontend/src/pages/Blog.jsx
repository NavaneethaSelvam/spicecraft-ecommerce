import React from "react";
import { Link } from "react-router-dom";
import "./Blog.css";

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

const Blog = () => {
  return (
    <main className="blog-page">

      <section className="blog-hero">
        <span>THE SPICECRAFT JOURNAL</span>

        <h1>
          Stories, Spice &amp;
          <br />
          Everyday Cooking
        </h1>

        <p>
          Explore spice guides, cooking inspiration and stories from the
          world of authentic Indian flavours.
        </p>
      </section>

      <section className="blog-section">

        <div className="blog-heading">
          <div>
            <span className="blog-eyebrow">FROM OUR JOURNAL</span>
            <h2>Latest Stories</h2>
          </div>

          <p>
            Helpful ideas and inspiration to make your everyday cooking
            more flavourful.
          </p>
        </div>

        <div className="blog-grid">

          {blogPosts.map((post) => (
            <article className="blog-card" key={post.id}>

              <Link
                to={`/blog/${post.id}`}
                className="blog-image"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  onError={(e) => {
                    e.currentTarget.src =
                      "/images/product-placeholder.jpg";
                  }}
                />
              </Link>

              <div className="blog-content">

                <span className="blog-category">
                  {post.category}
                </span>

                <Link
                  to={`/blog/${post.id}`}
                  className="blog-title"
                >
                  {post.title}
                </Link>

                <p>{post.excerpt}</p>

                <div className="blog-meta">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>

                <Link
                  to={`/blog/${post.id}`}
                  className="blog-read-more"
                >
                  Read Article →
                </Link>

              </div>

            </article>
          ))}

        </div>

      </section>

      <section className="blog-newsletter">

        <span>STAY IN THE LOOP</span>

        <h2>Bring More Flavour to Your Inbox</h2>

        <p>
          Get cooking inspiration, spice tips and new SpiceCraft updates.
        </p>

        <div className="blog-subscribe">
          <input
            type="email"
            placeholder="Enter your email address"
          />

          <button type="button">
            Subscribe
          </button>
        </div>

      </section>

    </main>
  );
};

export default Blog;