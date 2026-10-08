import "./AnnouncementBar.css";

function AnnouncementBar() {
  return (
    <div className="announcement-bar">
      <div className="announcement-content">
        <span className="announcement-icon">🌿</span>

        <span>
          Authentic Indian Spices
        </span>

        <span className="announcement-dot">•</span>

        <span>
          Freshly Packed
        </span>

        <span className="announcement-dot">•</span>

        <span>
          Delivered Across India
        </span>
      </div>
    </div>
  );
}

export default AnnouncementBar;