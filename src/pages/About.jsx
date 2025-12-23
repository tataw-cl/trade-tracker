import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function About() {
  return (
    <div className="page-container about-page">
      <Header />
      <main className="page-main">
        <div className="page-header">
          <h1>About Trade Tracker</h1>
        </div>

        <section className="content">
          <p>
            Trade Tracker is a lightweight checklist and trade journaling tool
            designed to help traders capture their pre-trade confluence and
            track outcomes over time. It focuses on simplicity, privacy, and
            rapid capture of trade rationale.
          </p>

          <h2>Philosophy</h2>
          <p>
            We believe good risk management and a repeatable process beat
            complicated indicators. This app is built to support that process
            with minimal friction.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
