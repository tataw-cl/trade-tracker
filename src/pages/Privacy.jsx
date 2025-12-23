import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Privacy() {
  return (
    <div className="page-container privacy-page">
      <Header />
      <main className="page-main">
        <div className="page-header">
          <h1>Privacy Policy</h1>
        </div>

        <section className="content">
          <p>
            Your privacy matters. Trade Tracker collects only the data you
            choose to save (trade tiles, notes, and timestamps). We do not sell
            your personal data. Authentication is provided by your configured
            Supabase backend; profile and trade data live in your project’s
            database.
          </p>

          <h2>What we store</h2>
          <ul>
            <li>Trade checklist entries and payloads you save</li>
            <li>Optional notes you enter</li>
            <li>Authentication metadata required by your Supabase project</li>
          </ul>

          <h2>Third-party services</h2>
          <p>
            This app may use third-party services (e.g., Supabase) to store
            data. Please review those providers' privacy policies for details
            about their handling of personal data.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
