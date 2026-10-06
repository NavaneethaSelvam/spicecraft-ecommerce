const posts = [
  {
    title: "How Indian Masalas Are Made",
    category: "Spice Knowledge",
  },
  {
    title: "The Secret Behind Chettinad Flavours",
    category: "Regional Food Stories",
  },
  {
    title: "5 Tips for Better Biryani",
    category: "Cooking Tips",
  },
  {
    title: "Understanding Indian Spice Blends",
    category: "Indian Cuisine",
  },
];

export default function Blog() {
  return (
    <main className="page">
      <div className="page-heading">
        <span className="eyebrow">THE SPICECRAFT JOURNAL</span>
        <h1>Stories from the Spice Kitchen</h1>
        <p>Discover food stories, spice knowledge and cooking inspiration.</p>
      </div>

      <div className="blog-grid">
        {posts.map((post) => (
          <article className="blog-card" key={post.title}>
            <div className="blog-image">🌿</div>

            <div>
              <span>{post.category}</span>
              <h2>{post.title}</h2>
              <p>
                Explore the stories, techniques and traditions behind
                India's incredible flavours.
              </p>
              <button>Read Story →</button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}