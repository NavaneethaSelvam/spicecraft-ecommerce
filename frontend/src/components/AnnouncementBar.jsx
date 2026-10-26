
function AnnouncementBar() {
  return (
    <div className="w-full bg-[#6b3d24] px-3 py-2 text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-[10px] font-medium tracking-wide sm:gap-x-4 sm:text-xs">
        <span aria-hidden="true">🌿</span>

        <span>Authentic Indian Spices</span>

        <span className="hidden text-amber-200/80 sm:inline">•</span>

        <span>Freshly Packed</span>

        <span className="hidden text-amber-200/80 sm:inline">•</span>

        <span>Delivered Across India</span>
      </div>
    </div>
  );
}

export default AnnouncementBar;