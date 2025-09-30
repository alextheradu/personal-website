import { useState } from "react";
// Corrected stylesheet filename
import "./Pricing.css";

type Plan = {
  id: "basic" | "standard" | "premium";
  name: string;
  monthly: number;
  yearly: number;
  perks: string[];
  featured?: boolean;
};

const PLANS: Plan[] = [
  { id: "basic", name: "Basic Plan", monthly: 4.99, yearly: 49.99, perks: ["2 TB additional storage", "Up to 1 GB file size", "Up to 5 projects"] },
  { id: "standard", name: "Standard Plan", monthly: 9.99, yearly: 99.99, perks: ["10 TB additional storage", "Unlimited file size", "Up to 10 projects"], featured: true },
  { id: "premium", name: "Premium Plan", monthly: 19.99, yearly: 199.99, perks: ["Unlimited storage", "Unlimited file size", "Permanent membership"] },
];

export default function PricingPlans() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <section id="pricing" className="content-section pricing-section fade-in-section">
      <div className="section-header">
        <h2 className="section-title">Choose your plan</h2>
        <div className="section-divider"></div>
      </div>

      <div className="pricing-top">
        <span className="trial-pill">🌱 14 days free trial</span>

        <div className="billing-toggle" role="tablist" aria-label="Billing frequency">
          <button
            role="tab"
            aria-selected={billing === "monthly"}
            className={billing === "monthly" ? "toggle-btn active" : "toggle-btn"}
            onClick={() => setBilling("monthly")}
          >
            Monthly
          </button>
          <button
            role="tab"
            aria-selected={billing === "yearly"}
            className={billing === "yearly" ? "toggle-btn active" : "toggle-btn"}
            onClick={() => setBilling("yearly")}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="plans-grid">
        {PLANS.map((p) => (
          <div key={p.id} className={`plan-card ${p.featured ? "featured" : ""}`}>
            {p.featured && <span className="badge">Most Popular</span>}

            <div className="plan-head">
              <span className={`dot ${p.id}`}></span>
              <h3 className="plan-name">{p.name}</h3>
            </div>

            <div className="plan-price">
              <span className="amount">${(billing === "monthly" ? p.monthly : p.yearly).toFixed(2)}</span>
              <span className="per">/ {billing}</span>
            </div>

            <ul className="plan-perks">
              {p.perks.map((perk) => (
                <li key={perk}>
                  <svg viewBox="0 0 24 24" className="check">
                    <path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{perk}</span>
                </li>
              ))}
            </ul>

            <button className={`plan-cta ${p.featured ? "primary" : "ghost"}`}>Get Plan</button>
          </div>
        ))}
      </div>
    </section>
  );
}
