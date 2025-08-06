import React, { useState } from "react";
import axios from "axios";
import AnnualCostSaved from "./Annual_cost_saved";
import ReferralAIRevenueImpact from "./ReferralAIRevenueImpact";
import { toast } from 'react-toastify';


const apiUrl = import.meta.env.VITE_API_URL;


const ReferralROIApp = () => {
  const [formData, setFormData] = useState({
    referral_coordinators: "",
    hcls_monthly: "",
    assists_monthly: "",
    docintel_monthly: "",
    workflow_standard_yearly: "",
    workflow_pro_yearly: "",
  });

  const [result, setResult] = useState({});

  const [showAnnual, setShowAnnual] = useState(false);
  const [showImpact, setShowImpact] = useState(false);
  const [showROIResult, setShowROIResult] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Remove any non-digit/decimal characters
    const numericValue = value.replace(/[^0-9.]/g, "");

    // Format with commas if it's a valid number
    const formattedValue = numericValue
      ? parseFloat(numericValue).toLocaleString("en-US", {
          maximumFractionDigits: 2,
        })
      : "";

    setFormData({ ...formData, [name]: formattedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const rawData = Object.fromEntries(
        Object.entries(formData).map(([key, val]) => [
          key,
          val.replace(/,/g, ""),
        ])
      );
      const response = await axios.post(
        `${apiUrl}/calculate`,
        rawData
      );

      setResult(response.data);
      console.log(response.data);
      setShowROIResult(true);
    }catch(error ){
    if (error.response && error.response.data) {
      const err = error.response.data;
      // Show error on the UI
      toast.error(`${err.detail}`);
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  };
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="bg-primary bg-gradient text-white text-center p-4 rounded-3 shadow-sm mb-4">
        <h1 className="fw-bold mb-2">Referral Management ROI Calculator</h1>
        <p className="lead">
          Calculate the return on investment for your AI-powered referral
          management system
        </p>
      </div>
      <div>
        <p className="text-success">
           Please Enter The Below Details And Click the
          Calculate Total Licensing Expense Button{" "}
        </p>
      </div>
      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="row g-4 mb-4">
          {[
            {
              name: "referral_coordinators",
              label: "Number of Referral Coordinators",
            },
            {
              name: "hcls_monthly",
              label: "HCLS-SM Professional v3 - Fulfiller ($/month)",
            },
            { name: "assists_monthly", label: "Assists - Fulfiller ($/month)" },
            {
              name: "docintel_monthly",
              label: "Document Intelligence 100K Pages ($/month)",
            },
            {
              name: "workflow_standard_yearly",
              label: "Workflow Data Fabric Standard 5K Pages ($/year)",
            },
            {
              name: "workflow_pro_yearly",
              label: "Workflow Data Fabric Pro V3 100K Pages ($/year)",
            },
          ].map(({ name, label }) => {

            const monthlyValue = parseFloat(formData[name].replace(/,/g, ""));
            const yearlyEstimate = !isNaN(monthlyValue)
              ? monthlyValue * 12
              : null;

            return (
              <div className="col-md-6" key={name}>
                <div className="form-floating position-relative">
                  <input
                    type="text"
                    className="form-control"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={label}
                  />
                  <label>{label}</label>

                  {/* Show yearly value hint for monthly fields */}
                  {yearlyEstimate && name.includes("monthly") && (
                    <small
                      className="text-muted position-absolute"
                      style={{ top: "100%", left: "0", fontSize: "0.85rem" }}
                    >
                      ≈ ${yearlyEstimate.toLocaleString()} per year
                    </small>
                  )}
                </div>
              </div>
            );
          })}

          {/* Buttons */}
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-4">
            <div>
              <button type="submit" className="btn btn-primary btn-lg px-4">
                Calculate Total Licensing Expense
              </button>
            </div>
          </div>
        </div>
      </form>

      {showROIResult && result && (
        <div className="container mt-3">
          {/* ROI Results Block */}
          <div className="bg-white p-3 rounded shadow-sm border mb-3">
            <h4 className="mb-4 text-success fw-bold">
              Total Licensing Expense
            </h4>

            <div className="row row-cols-1 g-2"> {/* Smaller gutter (gap) */}

              {Object.entries(result).map(([key, value]) => (
                <div key={key} className="col">
                  <div
                    className={`p-3 rounded ${
                      key === "Total Licensing Expense"
                        ? "bg-light border-start border-4 border-success"
                        : "bg-white border"
                    }`}
                  >
                    <div className="fw-semibold text-dark">{key}</div>
                    <div className="text-success h5 mb-0">
                      $
                      {typeof value === "string"
                        ? value
                        : Number(value).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <p className="text-success">
              To Calculate Annual Labour Cost Savings
              Click The Annual Labour Cost Saved Button And Fill The Necessary
              Details
            </p>
          </div>

          {/* Button & Output Blocks */}
          <div className="d-grid gap-1 mt-2">

            {/* Button 1: Annual Labor Cost Saved */}
            <button
              type="button"
              className="btn btn-primary btn-lg shadow-sm d-flex align-items-center justify-content-center gap-2"
              onClick={() => {
                setShowAnnual(true);
                setShowImpact(false);
              }}
            >
              <i className="bi bi-calculator"></i>
              Annual Labor Cost Saved
            </button>

            {/* Output 1: AnnualCostSaved Component */}
            {showAnnual && (
              <>
                <div className="mb-0">
                  <AnnualCostSaved />
                </div>

                {/* Button 2: Revenue Impact - shown only after AnnualCostSaved */}
                <div>
                  <p className="text-success mb-1">
                     To Calculate Referral AI Revenue Impact Click The Referral AI Revenue Impact Button And Fill The
                    Necessary Details
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-lg shadow-sm d-flex align-items-center justify-content-center gap-2"
                  onClick={() => {
                    setShowImpact(true);
                    setShowAnnual(false);
                  }}
                >
                  <i className="bi bi-graph-up-arrow"></i>
                  Referral AI Revenue Impact
                </button>
              </>
            )}

            {/* Output 2: ReferralAIRevenueImpact Component */}
            {showImpact && <ReferralAIRevenueImpact />}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralROIApp;