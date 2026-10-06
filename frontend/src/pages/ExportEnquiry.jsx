export default function ExportEnquiry() {
  return (
    <main className="page enquiry-page">
      <div className="page-heading">
        <span className="eyebrow">GLOBAL FLAVOURS</span>
        <h1>Export Enquiry</h1>
        <p>
          Interested in bringing authentic Indian spices to your market?
        </p>
      </div>

      <form className="enquiry-form">
        <input placeholder="Name" required />
        <input placeholder="Company" required />
        <input type="email" placeholder="Email" required />
        <input placeholder="Phone" required />
        <input placeholder="Country" required />
        <input placeholder="Product Interest" />
        <input placeholder="Quantity" />

        <textarea
          placeholder="Tell us about your export requirement"
          rows="6"
        />

        <button className="btn btn-primary">
          Send Export Enquiry
        </button>
      </form>
    </main>
  );
}