import { useCallback, useEffect, useRef, useState } from "react";
import {
  ImagePlus, RefreshCw, Search, Trash2, Upload, Eye, EyeOff,
  Pencil, X, Images, AlertCircle, CheckCircle2, ChevronLeft, ChevronRight,
} from "lucide-react";
import api from "../api";
const SECTIONS = [
  { value: "hero", label: "Hero Carousel" },
  { value: "banner", label: "Banners" },
  { value: "category", label: "Categories" },
  { value: "dish", label: "Dish Images" },
  { value: "product", label: "Products / Best Sellers" },
  { value: "recipe", label: "Recipes" },
  { value: "blog", label: "Blog" },
  { value: "trust", label: "Trust & Quality" },
];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ITEMS_PER_PAGE = 12;

const getErrorMessage = (error) =>
  error?.response?.data?.detail ||
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong. Please try again.";

const getMediaImageUrl = (asset) => {
  const imageUrl = asset?.image_url;
  if (!imageUrl || typeof imageUrl !== "string") return "";
  const trimmed = imageUrl.trim();
  if (!trimmed) return "";
  if (/^(https?:\/\/|blob:|data:)/i.test(trimmed)) return trimmed;
  const baseURL = api.defaults.baseURL || "http://127.0.0.1:8000";
  try {
    return new URL(trimmed, `${baseURL.replace(/\/+$/, "")}/`).href;
  } catch {
    return "";
  }
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
      });
};

function ImagePlaceholder({ label = "Image unavailable" }) {
  return (
    <div className="flex h-full min-h-32 w-full flex-col items-center justify-center gap-2 rounded-xl bg-[#f3ece4] p-4 text-center text-sm text-stone-600">
      <ImagePlus size={32} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export default function AdminMedia() {
  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [filterSection, setFilterSection] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [title, setTitle] = useState("");
  const [altText, setAltText] = useState("");
  const [uploadSection, setUploadSection] = useState("hero");
  const [editingAsset, setEditingAsset] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAltText, setEditAltText] = useState("");
  const [editSection, setEditSection] = useState("hero");
  const [editFile, setEditFile] = useState(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState("");
  const [notice, setNotice] = useState({ type: "", message: "" });
  const showNotice = (type, message) => setNotice({ type, message });

  const loadMedia = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterSection !== "all") params.section = filterSection;
      const response = await api.get("/admin/media", { params });
      setMedia(Array.isArray(response.data) ? response.data : response.data?.items ?? response.data?.media ?? []);
    } catch (error) {
      showNotice("error", getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [filterSection]);

  useEffect(() => { loadMedia(); }, [loadMedia]);
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);
  useEffect(() => () => { if (editPreviewUrl) URL.revokeObjectURL(editPreviewUrl); }, [editPreviewUrl]);
  useEffect(() => { setCurrentPage(1); }, [searchTerm, filterSection]);

  const resetUploadForm = () => {
    setSelectedFile(null); setTitle(""); setAltText(""); setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validateFile = (file, input) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      showNotice("error", "Choose a JPG, PNG or WEBP image.");
      if (input) input.value = "";
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      showNotice("error", "Image size must be 5 MB or less.");
      if (input) input.value = "";
      return false;
    }
    return true;
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file || !validateFile(file, event.target)) return;
    setSelectedFile(file);
    setTitle((current) => current || file.name.replace(/\.[^.]+$/, ""));
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile) return showNotice("error", "Please choose an image first.");
    if (!title.trim()) return showNotice("error", "Please enter an image title.");
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("section", uploadSection);
    formData.append("title", title.trim());
    formData.append("alt_text", altText.trim());
    setUploading(true);
    setNotice({ type: "", message: "" });
    try {
      await api.post("/admin/media/upload", formData);
      showNotice("success", "Image uploaded successfully.");
      resetUploadForm();
      setCurrentPage(1);
      await loadMedia();
    } catch (error) {
      showNotice("error", getErrorMessage(error));
    } finally {
      setUploading(false);
    }
  };

  const openEdit = (asset) => {
    setEditingAsset(asset);
    setEditTitle(asset.title ?? "");
    setEditAltText(asset.alt_text ?? "");
    setEditSection(asset.section ?? "hero");
    setEditFile(null);
    setEditPreviewUrl("");
    if (editFileInputRef.current) editFileInputRef.current.value = "";
  };

  const closeEdit = () => {
    setEditingAsset(null);
    setEditFile(null);
    setEditPreviewUrl("");
    if (editFileInputRef.current) editFileInputRef.current.value = "";
  };

  const handleEditFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file || !validateFile(file, event.target)) return;
    setEditFile(file);
    setEditPreviewUrl(URL.createObjectURL(file));
  };

  const saveEdit = async (event) => {
    event.preventDefault();
    if (!editingAsset) return;
    if (!editTitle.trim()) return showNotice("error", "Image title cannot be empty.");
    setSavingId(editingAsset.id);
    setNotice({ type: "", message: "" });
    try {
      const formData = new FormData();
      if (editFile) formData.append("file", editFile);
     await api.patch(`/admin/media/${editingAsset.id}`, editFile ? formData : null, {
  params: {
    title: editTitle.trim(),
    alt_text: editAltText.trim(),
    section: editSection,
  },
});
      closeEdit();
      showNotice("success", editFile ? "Image and details updated." : "Media details updated.");
      await loadMedia();
    } catch (error) {
      showNotice("error", getErrorMessage(error));
    } finally {
      setSavingId(null);
    }
  };

  const toggleActive = async (asset) => {
    setSavingId(asset.id);
    try {
      await api.patch(`/admin/media/${asset.id}`, null, { params: { is_active: !asset.is_active } });
      showNotice("success", `Image ${asset.is_active ? "deactivated" : "activated"}.`);
      await loadMedia();
    } catch (error) {
      showNotice("error", getErrorMessage(error));
    } finally {
      setSavingId(null);
    }
  };

  const deleteMedia = async (asset) => {
    if (!window.confirm(`Delete "${asset.title}" from the media library? This removes its database record.`)) return;
    setDeletingId(asset.id);
    try {
      await api.delete(`/admin/media/${asset.id}`);
      setMedia((items) => items.filter((item) => item.id !== asset.id));
      showNotice("success", "Media record deleted.");
    } catch (error) {
      showNotice("error", getErrorMessage(error));
    } finally {
      setDeletingId(null);
    }
  };

  const filteredMedia = media.filter((asset) => {
    const q = searchTerm.trim().toLowerCase();
    return !q || (asset.title ?? "").toLowerCase().includes(q) ||
      (asset.alt_text ?? "").toLowerCase().includes(q) ||
      (asset.section ?? "").toLowerCase().includes(q);
  });
  const totalPages = Math.max(1, Math.ceil(filteredMedia.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedMedia = filteredMedia.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const activeCount = media.filter((asset) => asset.is_active).length;
  const pageNumbers = [];
  for (let p = Math.max(1, safePage - 2); p <= Math.min(totalPages, safePage + 2); p++) pageNumbers.push(p);
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    document.getElementById("media-library")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0] px-4 py-6 text-stone-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-600"><Images size={17} /> Admin / Content Management</div>
            <h1 className="text-3xl font-bold tracking-tight">Media Manager</h1>
            <p className="mt-2 text-sm text-stone-600">Manage the images used across your SpiceCraft storefront.</p>
          </div>
          <button type="button" onClick={loadMedia} disabled={loading} className="inline-flex items-center gap-2 rounded-lg border border-[#e4d6c8] bg-white px-4 py-2.5 text-sm font-semibold disabled:opacity-60"><RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh</button>
        </header>

        {notice.message && <div role="status" className={`mb-5 flex items-start gap-3 rounded-lg border p-4 text-sm ${notice.type === "success" ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-800"}`}>
          {notice.type === "success" ? <CheckCircle2 size={19} /> : <AlertCircle size={19} />}
          <span className="flex-1">{notice.message}</span>
          <button type="button" onClick={() => setNotice({ type: "", message: "" })} aria-label="Dismiss"><X size={17} /></button>
        </div>}

        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Summary label="Total images loaded" value={media.length} />
          <Summary label="Active images" value={activeCount} color="text-green-700" />
          <Summary label="Inactive images" value={media.length - activeCount} color="text-[#9b6a4c]" />
        </div>

        <section className="mb-8 rounded-2xl border border-[#eadfd3] bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center gap-3"><div className="rounded-xl bg-[#f5e8dc] p-2.5 text-[#8c3b1e]"><ImagePlus size={22} /></div><div><h2 className="text-xl font-bold">Upload new image</h2><p className="mt-1 text-sm text-[#89786b]">JPG, PNG or WEBP · Maximum 5 MB</p></div></div>
          <form onSubmit={handleUpload} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold">Image file</label>
              <button type="button" onClick={() => fileInputRef.current?.click()} className="flex min-h-60 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#d9c3b0] bg-[#fcfaf7] p-5 text-center">
                {previewUrl ? <img src={previewUrl} alt="Upload preview" className="max-h-52 max-w-full rounded-xl object-contain" /> : <><Upload size={34} /><span className="mt-3 font-semibold">Choose an image</span><span className="mt-1 text-sm">Click here to browse files</span></>}
              </button>
              <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={handleFileChange} className="hidden" />
              {selectedFile && <p className="mt-2 break-all text-xs">{selectedFile.name} · {(selectedFile.size / 1024).toFixed(0)} KB</p>}
            </div>
            <div className="space-y-4">
              <Field label="Image title *" id="media-title"><input id="media-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} required placeholder="Authentic Indian Spices" className={inputClass} /></Field>
              <Field label="Website section *" id="media-section"><select id="media-section" value={uploadSection} onChange={(e) => setUploadSection(e.target.value)} className={inputClass}>{SECTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select></Field>
              <Field label="Alt text" id="media-alt"><textarea id="media-alt" value={altText} onChange={(e) => setAltText(e.target.value)} maxLength={300} rows={3} placeholder="Describe the image for accessibility" className={inputClass} /></Field>
              <button type="submit" disabled={uploading || !selectedFile} className={primaryButton}>{uploading ? "Uploading..." : <><Upload size={17} /> Upload image</>}</button>
            </div>
          </form>
        </section>

        <section id="media-library" className="scroll-mt-5 rounded-2xl border border-[#eadfd3] bg-white p-4 shadow-sm sm:p-6 lg:p-7">
          <div className="mb-6 flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
            <div><h2 className="text-xl font-bold">Media library</h2><p className="mt-1 text-sm text-[#89786b]">Browse, search and manage your images.</p></div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2" /><input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search images..." aria-label="Search media" className={`${inputClass} pl-9 sm:w-56`} /></div>
              <select value={filterSection} onChange={(e) => setFilterSection(e.target.value)} aria-label="Filter by section" className={inputClass}><option value="all">All sections</option>{SECTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select>
            </div>
          </div>
          {!loading && filteredMedia.length > 0 && <p className="mb-5 text-sm text-[#89786b]">Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredMedia.length)} of {filteredMedia.length} images · Page {safePage} of {totalPages}</p>}
          {loading ? <div className="flex min-h-56 items-center justify-center gap-3"><RefreshCw className="animate-spin" /> Loading media library...</div>
          : !filteredMedia.length ? <div className="flex min-h-56 flex-col items-center justify-center text-center"><Images size={40} /><h3 className="mt-3 font-semibold">No images found</h3><p className="mt-1 text-sm">Upload an image or change your search/filter.</p></div>
          : <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {paginatedMedia.map((asset) => <MediaCard key={asset.id} asset={asset} onEdit={openEdit} onToggle={toggleActive} onDelete={deleteMedia} saving={savingId === asset.id} deleting={deletingId === asset.id} />)}
            </div>
            {totalPages > 1 && <div className="mt-8 flex flex-wrap items-center justify-center gap-2 border-t pt-6">
              <button type="button" onClick={() => goToPage(safePage - 1)} disabled={safePage === 1} className={pageButton}> <ChevronLeft size={16} /> Previous</button>
              {pageNumbers.map((p) => <button key={p} type="button" onClick={() => goToPage(p)} className={`${pageButton} ${p === safePage ? "bg-[#783b25] text-white" : ""}`}>{p}</button>)}
              <button type="button" onClick={() => goToPage(safePage + 1)} disabled={safePage === totalPages} className={pageButton}>Next <ChevronRight size={16} /></button>
            </div>}
          </>}
        </section>
      </div>

      {editingAsset && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) closeEdit(); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="edit-media-heading" className="my-auto max-h-[95vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
          <div className="mb-5 flex items-center justify-between"><h2 id="edit-media-heading" className="text-xl font-bold">Edit media details</h2><button type="button" onClick={closeEdit} aria-label="Close edit dialog"><X size={20} /></button></div>
          <div className="mb-5">
            <div className="mb-3 flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-[#faf7f2] p-3">
{(editPreviewUrl || getMediaImageUrl(editingAsset?.image_url)) && (
  <img
    src={editPreviewUrl || getMediaImageUrl(editingAsset?.image_url)}
    alt={editAltText || editingAsset?.alt_text || "Media preview"}
    className="h-full w-full rounded-xl object-contain"
  />
)}         
  </div>
  
            <label className="mb-2 block text-sm font-semibold">
  Replace image (optional)
</label>

<button
  type="button"
  onClick={() => editFileInputRef.current?.click()}
  className="flex min-h-24 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#d9c3b0] bg-[#fcfaf7] p-4 text-center transition hover:border-[#783b25] hover:bg-[#f5e8dc]"
>
  <ImagePlus size={28} className="text-[#8c3b1e]" />

  <span className="font-semibold text-[#8c3b1e]">
    {editFile ? "Choose another image" : "Choose an image"}
  </span>

  <span className="text-sm text-[#89786b]">
    JPG, PNG or WEBP · Maximum 5 MB
  </span>
</button>

<input
  id="edit-media-file"
  ref={editFileInputRef}
  type="file"
  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
  onChange={handleEditFileChange}
  className="hidden"
/>

{editFile && (
  <p className="mt-2 break-all text-xs text-stone-600">
    Selected: {editFile.name} · {(editFile.size / 1024).toFixed(0)} KB
  </p>
)}
 </div>
          <form onSubmit={saveEdit} className="space-y-4">
            <Field label="Title *" id="edit-media-title"><input id="edit-media-title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} maxLength={200} required className={inputClass} /></Field>
            <Field label="Section" id="edit-media-section"><select id="edit-media-section" value={editSection} onChange={(e) => setEditSection(e.target.value)} className={inputClass}>{SECTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select></Field>
            <Field label="Alt text" id="edit-media-alt"><textarea id="edit-media-alt" value={editAltText} onChange={(e) => setEditAltText(e.target.value)} maxLength={300} rows={3} className={inputClass} /></Field>
            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end"><button type="button" onClick={closeEdit} className={pageButton}>Cancel</button><button type="submit" disabled={savingId === editingAsset.id} className={primaryButton}>{savingId === editingAsset.id && <RefreshCw size={16} className="animate-spin" />} Save changes</button></div>
          </form>
        </section>
      </div>}
    </div>
  );
}

const inputClass = "w-full rounded-xl border border-[#e4d6c8] bg-white px-3 py-3 outline-none focus:border-[#783b25]";
const primaryButton = "inline-flex items-center justify-center gap-2 rounded-xl bg-[#783b25] px-5 py-3 font-semibold text-white hover:bg-[#4d2518] disabled:cursor-not-allowed disabled:opacity-50";
const pageButton = "inline-flex items-center justify-center gap-1 rounded-lg border border-[#e4d6c8] px-3 py-2 text-sm font-semibold disabled:opacity-40";
function Summary({ label, value, color = "" }) {
  return <div className="rounded-2xl border border-[#eee2d5] bg-white p-5 shadow-sm"><p className="text-sm text-[#89786b]">{label}</p><p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p></div>;
}
function Field({ label, id, children }) {
  return <div><label htmlFor={id} className="mb-2 block text-sm font-semibold">{label}</label>{children}</div>;
}
function MediaCard({ asset, onEdit, onToggle, onDelete, saving, deleting }) {
  const [failed, setFailed] = useState(false);
  const url = getMediaImageUrl(asset);
  useEffect(() => { setFailed(false); }, [url]);
  return <article className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#eee2d5] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
    <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-[#faf7f2] p-4">
      {url && !failed ? <img src={url} alt={asset.alt_text || asset.title || "Media image"} loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-contain transition-transform group-hover:scale-105" /> : <ImagePlaceholder label="Image preview unavailable" />}
      <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${asset.is_active ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"}`}>{asset.is_active ? "Active" : "Inactive"}</span>
    </div>
    <div className="flex flex-1 flex-col p-4">
      <h3 title={asset.title || "Untitled image"} className="truncate font-bold">{asset.title || "Untitled image"}</h3>
      <div className="mt-2"><span className="inline-flex rounded-full bg-[#f5e8dc] px-2.5 py-1 text-xs font-semibold text-[#8c3b1e]">{SECTIONS.find((s) => s.value === asset.section)?.label || asset.section}</span></div>
      <p className="mt-3 line-clamp-2 min-h-10 break-words text-sm text-[#89786b]">{asset.alt_text || "No alt text provided"}</p>
      <p className="mt-3 text-xs text-stone-500">Added {formatDate(asset.created_at)}</p>
      <div className="mt-auto grid grid-cols-3 gap-2 border-t border-[#eee2d5] pt-4">
        <button type="button" onClick={() => onEdit(asset)} className="inline-flex items-center justify-center gap-1 rounded-lg bg-[#f5e8dc] px-1.5 py-2.5 text-xs font-semibold text-[#8c3b1e]"><Pencil size={14} /> Edit</button>
        <button type="button" onClick={() => onToggle(asset)} disabled={saving || deleting} className="inline-flex items-center justify-center gap-1 rounded-lg border border-[#e4d6c8] px-1.5 py-2.5 text-xs font-semibold disabled:opacity-50">{saving ? <RefreshCw size={14} className="animate-spin" /> : asset.is_active ? <EyeOff size={14} /> : <Eye size={14} />}{asset.is_active ? "Hide" : "Show"}</button>
        <button type="button" onClick={() => onDelete(asset)} disabled={saving || deleting} className="inline-flex items-center justify-center gap-1 rounded-lg border border-red-200 px-1.5 py-2.5 text-xs font-semibold text-red-700 disabled:opacity-50">{deleting ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />} Delete</button>
      </div>
    </div>
  </article>;
}
