import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const apiUrl = import.meta.env.VITE_API_URL;

const ReferralAIRevenueImpact = () => {
  const [inputData, setInputData] = useState({
    referral_opportunity: "",
    referral_value: "",
    baseline_leakage_rate_pct: "",
    baseline_completed_visit_rate_pct: "",
    ai_leakage_rate_pct: "",
    ai_completed_visit_rate_pct: "",
  });

  const [outputData, setOutputData] = useState({
    ai_completed_visits: 0,
    ai_leakage: 0,
    ai_revenue: 0,
    ai_revenue_impact: 0,
    baseline_completed_visits: 0,
    baseline_leakage: 0,
    baseline_revenue: 0,
    referral_opportunity: 0,
    referral_value: 0,
    total_possible_referral_revenue: 0,
  });

   const [showOutput, setShowOutput] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/calculate-referral-impact`,
        inputData
      );
      setOutputData(response.data);
      setShowOutput(true)
      console.log("revenueImpact data:", response.data);
    }catch(error ){
    if (error.response && error.response.data) {
      const err = error.response.data;
      // Show error on the UI
      toast.error(` ${err.detail}`);
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  };
  };

  return (
    <div className="container my-5 p-4 rounded shadow-sm bg-white border">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary">Referral AI Revenue Impact</h2>
        <p className="text-muted">
          Estimate the revenue uplift with AI-driven referral optimization
        </p>
        <hr className="mb-4"/>

        
      </div>
      <div>
          <p className="text-success mb-3"> Please Enter The Below Details And Click the Calculate Revenue Impact  Button  </p>
        </div>

      <div className="row g-4 p-3 bg-light rounded border mb-4 mt-3">
        {/* Input Fields */}

        <div className="col-md-6">
          <label className="form-label">Referral Opportunity</label>
          <input
            type="string"
            className="form-control"
            name="referral_opportunity"
            placeholder="e.g. 40"
            value={inputData.referral_opportunity}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Referral AI Leakage Rate (%)</label>
          <input
            type="string"
            className="form-control"
            name="ai_leakage_rate_pct"
            placeholder="e.g. 55"
            value={inputData.ai_leakage_rate_pct}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">
            Referral AI Completed Visit Rate (%)
          </label>
          <input
            type="string"
            className="form-control"
            name="ai_completed_visit_rate_pct"
            placeholder="e.g. 40"
            value={inputData.ai_completed_visit_rate_pct}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Referral Value </label>
          <input
            type="string"
            className="form-control"
            name="referral_value"
            placeholder="e.g. 40"
            value={inputData.referral_value}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Baseline Leakage Rate (%)</label>
          <input
            type="string"
            className="form-control"
            name="baseline_leakage_rate_pct"
            placeholder="e.g. 40"
            value={inputData.baseline_leakage_rate_pct}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">
            Baseline Completed Visit Rate (%)
          </label>
          <input
            type="string"
            className="form-control"
            name="baseline_completed_visit_rate_pct"
            placeholder="e.g. 40"
            value={inputData.baseline_completed_visit_rate_pct}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="text-start">
        <button className="btn btn-outline-primary px-4" onClick={handleSubmit}>
          Calculate Revenue Impact
        </button>
      </div>

      {/* Output Section */}
      {showOutput && (
              <div className="mt-5">
        <h4 className="fw-semibold mb-3 text-success">Referral AI Revenue Impact</h4>
        <div className="row g-4">
          {[
            {
              label: "Total Possible Referral Revenue ($)",
              value: outputData.total_possible_referral_revenue,
            },
            { label: "Baseline Leakage", value: outputData.baseline_leakage },
            {
              label: "Baseline Completed Visits",
              value: outputData.baseline_completed_visits,
            },
            { label: "Baseline - Revenue  ($)", value: outputData. baseline_revenue },
            { label: "Referral AI Leakage", value: outputData.ai_leakage },
            {
              label: "Referral AI Completed Visits",
              value: outputData.baseline_completed_visits
,
            },
            {
              label: "Referral AI - Revenue  ($)",
              value: outputData. ai_revenue,
            },
            {
              label: "Referral AI Revenue Impact",
              value: outputData. ai_revenue_impact,
            },
          ].map((item, index, arr) => (
            <div className="col-md-6 col-lg-4" key={index}>
              <div
                className={`border rounded p-3 shadow-sm h-100 ${
                  index === arr.length - 1
                    ? "bg-success bg-opacity-10 border-success"
                    : "bg-white"
                }`}
              >
                <h6
                  className={
                    index === arr.length - 1 ? "text-success" : "text-secondary"
                  }
                >
                  {item.label}
                </h6>
                <p
                  className={`fs-5 fw-bold m-0 ${
                    index === arr.length - 1 ? "text-dark" : "text-dark"
                  }`}
                >
                  {typeof item.value === "number"
                    ? `$${item.value.toLocaleString()}`
                    : item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

    </div>
  );
};

export default ReferralAIRevenueImpact;
