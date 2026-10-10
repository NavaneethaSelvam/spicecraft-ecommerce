
import React from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  IndianRupee,
  Package,
  MessageSquare,
  LogOut,
  ArrowUpRight,
  Clock3,
} from "lucide-react";

import "./AdminDashboard.css";

const stats = [
  {
    title: "Total Orders",
    value: "128",
    detail: "Sample order data",
    icon: ShoppingBag,
  },
  {
    title: "Total Customers",
    value: "86",
    detail: "Sample customer data",
    icon: Users,
  },
  {
    title: "Total Revenue",
    value: "₹24,850",
    detail: "Sample revenue data",
    icon: IndianRupee,
  },
  {
    title: "Products",
    value: "24",
    detail: "Sample product count",
    icon: Package,
  },
];

const recentOrders = [
  {
    id: "#SC1001",
    customer: "Priya",
    amount: "₹499",
    status: "Delivered",
  },
  {
    id: "#SC1002",
    customer: "Arun",
    amount: "₹299",
    status: "Processing",
  },
  {
    id: "#SC1003",
    customer: "Kavitha",
    amount: "₹649",
    status: "Pending",
  },
  {
    id: "#SC1004",
    customer: "Rahul",
    amount: "₹199",
    status: "Delivered",
  },
];

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <Link to="/" className="admin-brand">
          <span className="admin-brand-icon">S</span>

          <span>
            <strong>SPICECRAFT</strong>
            <small>ADMIN PANEL</small>
          </span>
        </Link>

        <p className="admin-menu-label">WORKSPACE</p>

        <nav className="admin-side-nav">
          <a href="#overview" className="admin-nav-link active">
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </a>

          <a href="#orders" className="admin-nav-link">
            <ShoppingBag size={19} />
            <span>Orders</span>
          </a>

          <a href="#customers" className="admin-nav-link">
            <Users size={19} />
            <span>Customers</span>
          </a>

          {/* Products page link */}
          <Link to="/admin/products" className="admin-nav-link">
            <Package size={19} />
            <span>Products</span>
          </Link>

          <a href="#enquiries" className="admin-nav-link">
            <MessageSquare size={19} />
            <span>Enquiries</span>
          </a>
        </nav>

        <div className="admin-sidebar-bottom">
          <Link to="/" className="admin-logout">
            <LogOut size={18} />
            <span>Back to Store</span>
          </Link>
        </div>
      </aside>

      {/* Main Dashboard */}
      <main className="admin-main" id="overview">
        {/* Header */}
        <header className="admin-topbar">
          <div>
            <p className="admin-eyebrow">
              SPICECRAFT MANAGEMENT
            </p>

            <h1>Dashboard Overview</h1>

            <p className="admin-welcome">
              Welcome back, Admin. Here is your store overview.
            </p>
          </div>

          <div className="admin-profile">
            <div className="admin-avatar">A</div>

            <span>
              <strong>Administrator</strong>
              <small>Store Manager</small>
            </span>
          </div>
        </header>

        {/* Statistics Cards */}
        <section className="admin-stats-grid">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                className="admin-stat-card"
                key={stat.title}
              >
                <div className="admin-stat-top">
                  <span>{stat.title}</span>

                  <span className="admin-stat-icon">
                    <Icon size={21} />
                  </span>
                </div>

                <h2>{stat.value}</h2>

                <p>{stat.detail}</p>
              </article>
            );
          })}
        </section>

        {/* Orders and Quick Actions */}
        <section className="admin-content-grid">
          {/* Recent Orders */}
          <div
            className="admin-panel admin-orders-panel"
            id="orders"
          >
            <div className="admin-panel-heading">
              <div>
                <h2>Recent Orders</h2>
                <p>Latest sample order activity</p>
              </div>

              <ShoppingBag size={22} />
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.amount}</td>

                      <td>
                        <span
                          className={`admin-status ${order.status.toLowerCase()}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="admin-demo-note">
              <Clock3 size={15} />
              These are demonstration records, not real customer
              orders.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="admin-panel admin-activity-panel">
            <div className="admin-panel-heading">
              <div>
                <h2>Quick Actions</h2>
                <p>Store management shortcuts</p>
              </div>

              <ArrowUpRight size={22} />
            </div>

            <Link
              to="/admin/products"
              className="admin-action-link"
            >
              <span className="admin-action-icon">
                <Package size={19} />
              </span>

              <span>
                <strong>Manage Products</strong>
                <small>Add, edit and delete products</small>
              </span>

              <ArrowUpRight size={17} />
            </Link>

            <a
              href="#customers"
              className="admin-action-link"
            >
              <span className="admin-action-icon">
                <Users size={19} />
              </span>

              <span>
                <strong>Customer Overview</strong>
                <small>View the customer section</small>
              </span>

              <ArrowUpRight size={17} />
            </a>

            <a
              href="#enquiries"
              className="admin-action-link"
            >
              <span className="admin-action-icon">
                <MessageSquare size={19} />
              </span>

              <span>
                <strong>Business Enquiries</strong>
                <small>View the enquiry section</small>
              </span>

              <ArrowUpRight size={17} />
            </a>
          </div>
        </section>

        {/* Management Sections */}
        <section className="admin-lower-grid">
          <article
            className="admin-mini-panel"
            id="customers"
          >
            <Users size={22} />

            <h3>Customer Management</h3>

            <p>
              Customer records will appear here after backend
              integration.
            </p>
          </article>

          <article
            className="admin-mini-panel"
            id="products"
          >
            <Package size={22} />

            <h3>Product Management</h3>

            <p>
              Add, edit and manage products from the Products page.
            </p>

            <Link
              to="/admin/products"
              className="admin-manage-link"
            >
              Manage Products <ArrowUpRight size={15} />
            </Link>
          </article>

          <article
            className="admin-mini-panel"
            id="enquiries"
          >
            <MessageSquare size={22} />

            <h3>Business Enquiries</h3>

            <p>
              Bulk order and export enquiries will appear here
              after integration.
            </p>
          </article>
        </section>

        {/* Footer */}
        <footer className="admin-dashboard-footer">
          SpiceCraft Admin Panel · Frontend Preview
        </footer>
      </main>
    </div>
  );
}

export default AdminDashboard;

