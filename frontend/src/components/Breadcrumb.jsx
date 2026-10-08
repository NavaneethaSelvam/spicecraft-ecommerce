import React from "react";
import { Link } from "react-router-dom";

import "./Breadcrumb.css";

const Breadcrumb = ({ items = [] }) => {
  return (
    <nav
      className="breadcrumb"
      aria-label="Breadcrumb"
    >
      <Link to="/" className="breadcrumb-home">
        Home
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={`${item.label}-${index}`}>
            <span className="breadcrumb-separator">
              /
            </span>

            {isLast || !item.path ? (
              <span className="breadcrumb-current">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className="breadcrumb-link"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;