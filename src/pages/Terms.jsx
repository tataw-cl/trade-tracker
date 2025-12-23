import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Terms() {
  return (
    <div className="page-container terms-page">
      <Header />
      <main className="page-main">
        <div className="page-header">
          <h1>Terms of Service</h1>
        </div>

        <section className="content">
          <p>
            By using Trade Tracker you agree to the terms outlined here. Trade
            Tracker is provided "as-is" and is intended for educational and
            organizational purposes only. It is not financial advice.
          </p>

          <h2>Limitations</h2>
          <p>
            The authors are not responsible for trading decisions you make using
            information recorded in this application. Use the app at your own
            risk.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
