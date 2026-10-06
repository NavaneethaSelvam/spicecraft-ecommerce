export default function BulkOrder() {
  return (
    <main className="page enquiry-page">
      <div className="page-heading">
        <span className="eyebrow">BUSINESS ORDERS</span>
        <h1>Bulk Order Enquiry</h1>
        <p>Looking for SpiceCraft products in larger quantities?</p>
      </div>

      <form className="enquiry-form">
        <input placeholder="Name" required />
        <input placeholder="Company Name" required />
        <input type="email" placeholder="Email" required />
        <input placeholder="Phone" required />
        <input placeholder="Product Interest" />
        <input placeholder="Quantity Required" />
        <textarea placeholder="Tell us about your requirement" rows="6" />

        <button className="btn btn-primary">
          Submit Enquiry
        </button>
      </form>
    </main>
  );
}