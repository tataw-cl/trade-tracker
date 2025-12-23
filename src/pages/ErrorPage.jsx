import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ErrorPage({ error }) {
  const message =
    error?.message || "An unexpected error occurred. Please try again later.";
  return (
    <div className="page-container error-page">
      <Header />
      <main className="page-main">
        <div className="page-header">
          <h1>Something went wrong</h1>
        </div>
        <section className="content">
          <p>{message}</p>
          <p>
            If the problem persists, try reloading the page or contact the site
            administrator.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
