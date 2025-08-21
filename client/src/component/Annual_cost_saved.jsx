import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_API_URL;

const Annual_cost_saved = () => {
  const [inputData, setInputData] = useState({
    num_referral_coordinators: "",
    avg_annual_referral_volume_per_coordinator: "",
    distribution_easy_pct: "",
    distribution_moderate_pct: "",
    distribution_complex_pct: "",
    loaded_labor_cost_per_hour: "",
    easy_efficiency_gain: "",
    moderate_efficiency_gain: "",
    complex_efficiency_gain: "",
    touch_time_easy_pct: "",
    touch_time_moderate_pct: "",
    touch_time_complex_pct: "",
    baseline_time_easy_hrs: "",
    baseline_time_moderate_hrs: "",
    baseline_time_complex_hrs: "",
    referral_complexity_touch_time_easy: "",
    referral_complexity_touch_time_moderate: "",
    referral_complexity_touch_time_complex: "",
  });

  const [outputData, setOutputData] = useState({});
  const [showOutput, setShowOutput] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!/^\d*\.?\d*$/.test(value.replace(/,/g, ""))) return;

    const rawValue = value.replace(/,/g, "");
    const [integerPart, decimalPart] = rawValue.split(".");
    let formattedValue = Number(integerPart || 0).toLocaleString("en-US");
    if (rawValue.includes(".")) {
      formattedValue += "." + (decimalPart !== undefined ? decimalPart : "");
    }
    setInputData({ ...inputData, [name]: formattedValue });
  };

  const handleCalculate = async () => {
    try {
      const payload = Object.fromEntries(
        Object.entries(inputData).map(([key, val]) => [
          key,
          val.replace(/,/g, ""),
        ])
      );

      const response = await axios.post(
        `${apiUrl}/calculate-referral-efficiency`,
        payload
      );

      setOutputData(response.data);
      setShowOutput(true);
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(` ${error.response.data.detail}`);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  const format = (num) => {
    const sanitized =
      typeof num === "string" ? parseFloat(num.replace(/,/g, "")) : num;
    return Number(sanitized).toLocaleString("en-US", {
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="container py-5">
      <div className="card p-4 shadow">
        <h4 className="mb-4 text-primary fw-bold">Total Referrals by Complexity</h4>

        {/* --- General Inputs --- */}
        
        <div className="row g-3">
          {[
            {
              label: "Number of Referral Coordinators",
              name: "num_referral_coordinators",
              placeholder: "e.g. 70",
            },
            {
              label: "Avg. Annual Referral Volume per Coordinator",
              name: "avg_annual_referral_volume_per_coordinator",
              placeholder: "e.g. 3150",
            },
            {
              label: "Distribution – Easy (%)",
              name: "distribution_easy_pct",
              placeholder: "e.g. 60",
            },
            {
              label: "Distribution – Moderate (%)",
              name: "distribution_moderate_pct",
              placeholder: "e.g. 25",
            },
            {
              label: "Distribution – Complex (%)",
              name: "distribution_complex_pct",
              placeholder: "e.g. 15",
            },
            {
              label: "Loaded Labor Cost ($/hr)",
              name: "loaded_labor_cost_per_hour",
              placeholder: "e.g. 45",
            },
            {
              label: "Easy - Efficiency Gain (%)",
              name: "easy_efficiency_gain",
              placeholder: "e.g. 67",
            },
            {
              label: "Moderate - Efficiency Gain (%)",
              name: "moderate_efficiency_gain",
              placeholder: "e.g. 63",
            },
            {
              label: "Complex - Efficiency Gain (%)",
              name: "complex_efficiency_gain",
              placeholder: "e.g. 53",
            },
          ].map((field, index) => (
            <div className="col-md-6" key={index}>
              <label className="form-label">{field.label}</label>
              <input
                type="string"
                className="form-control"
                name={field.name}
                placeholder={field.placeholder}
                value={inputData[field.name] || ""}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>


        {/* --- Summary Output --- */}
        {showOutput && (
          <div className="mt-4">
            <div className="card p-4 shadow-sm">
              <h5 className="mb-3 text-success">Summary Output</h5>
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Output Metric</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Total Annual Referral Volume</td>
                    <td>{format(outputData.annual_referral_volume)}</td>
                  </tr>
                  <tr>
                    <td>Total Easy Referrals</td>
                    <td>{format(outputData.total_easy_referrals)}</td>
                  </tr>
                  <tr>
                    <td>Total Moderate Referrals</td>
                    <td>{format(outputData.total_moderate_referrals)}</td>
                  </tr>
                  <tr>
                    <td>Total Complex Referrals</td>
                    <td>{format(outputData.total_complex_referrals)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* --- Baseline Inputs + Output --- */}
      <div className="card p-4 shadow mt-5">
        <h5 className="mb-3 text-primary">Baseline Inputs</h5>
        <div className="row g-3">
          {[
            {
              label: "Easy - Baseline Time (hrs)",
              name: "baseline_time_easy_hrs",
              placeholder: "e.g. 0.25",
            },
            {
              label: "Moderate - Baseline Time (hrs)",
              name: "baseline_time_moderate_hrs",
              placeholder: "e.g. 8",
            },
            {
              label: "Complex - Baseline Time (hrs)",
              name: "baseline_time_complex_hrs",
              placeholder: "e.g. 40",
            },
            {
              label: "Easy - Baseline Touch Time (%)",
              name: "touch_time_easy_pct",
              placeholder: "e.g. 60",
            },
            {
              label: "Moderate - Baseline Touch Time (%)",
              name: "touch_time_moderate_pct",
              placeholder: "e.g. 10",
            },
            {
              label: "Complex - Baseline Touch Time (%)",
              name: "touch_time_complex_pct",
              placeholder: "e.g. 6",
            },
          ].map((field, index) => (
            <div className="col-md-6" key={index}>
              <label className="form-label">{field.label}</label>
              <input
                type="string"
                className="form-control"
                name={field.name}
                placeholder={field.placeholder}
                value={inputData[field.name] || ""}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>

        {/* Baseline Output */}
        {showOutput && (
          <div className="mt-4">
            <div>
              
              <div className="card p-4 shadow-sm">
                <h5 className="mb-3 text-success">
                  Work Hours Summary (Baseline with Touch Time)
                </h5>
                <table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Referral Complexity</th>
                      <th>Baseline Time (hrs)</th>
                      <th>Touch-time %</th>
                      <th>Work hrs / referral</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Easy</td>
                      <td>{format(outputData.baseline_hours.easy)}</td>
                      <td>{inputData.touch_time_easy_pct}%</td>
                      <td>
                        {format(
                          parseFloat(
                            outputData.baseline_work_hours.easy.replace(
                              /,/g,
                              ""
                            )
                          ) 
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Moderate</td>
                      <td>{format(outputData.baseline_hours.moderate)}</td>
                      <td>{inputData.touch_time_moderate_pct}%</td>
                      <td>
                        {format(
                          parseFloat(
                            outputData.baseline_work_hours.moderate.replace(
                              /,/g,
                              ""
                            )
                          ) 
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Complex</td>
                      <td>{format(outputData.baseline_hours.complex)}</td>
                      <td>{inputData.touch_time_complex_pct}%</td>
                      <td>
                        {format(
                          parseFloat(
                            outputData.baseline_work_hours.complex.replace(
                              /,/g,
                              ""
                            )
                          ) 
                        )}
                      </td>
                    </tr>
                    <tr className="table-warning fw-bold">
                      <td>Total</td>
                      <td className="text-success">
                        {format(outputData.baseline_hours_total)}
                      </td>
                      <td></td>
                      <td className="text-success">
                        {format(outputData.baseline_total_work_hours)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- Referral AI Inputs + Output --- */}
      <div className="card p-4 shadow mt-5">
        <h5 className="mb-3 text-primary">Referral AI Inputs</h5>
        <div className="row g-3">
          {[
            {
              label: "Easy - Referral Touch Time (%)",
              name: "referral_complexity_touch_time_easy",
              placeholder: "e.g. 5",
            },
            {
              label: "Moderate - Referral Touch Time (%)",
              name: "referral_complexity_touch_time_moderate",
              placeholder: "e.g. 5",
            },
            {
              label: "Complex - Referral Touch Time (%)",
              name: "referral_complexity_touch_time_complex",
              placeholder: "e.g. 5",
            },
          ].map((field, index) => (
            <div className="col-md-6" key={index}>
              <label className="form-label">{field.label}</label>
              <input
                type="string"
                className="form-control"
                name={field.name}
                placeholder={field.placeholder}
                value={inputData[field.name] || ""}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>

        {/* AI Output */}
        {showOutput && (
          <div className="mt-4">
            <div className="card p-4 shadow-sm mb-5" >
              <h5 className="mb-3 text-success">Referral AI Time (hrs)</h5>
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Referral Complexity</th>
                    <th>AI Time (hrs)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Easy</td>
                    <td>
                      {Number(outputData.ai_processing_times.easy).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td>Moderate</td>
                    <td>{format(outputData.ai_processing_times.moderate)}</td>
                  </tr>
                  <tr>
                    <td>Complex</td>
                    <td>{format(outputData.ai_processing_times.complex)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="card p-4 shadow-sm">
              <h5 className="mb-3 text-success">
                With AI Automation (with Touch Time)
              </h5>
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Referral Complexity</th>
                    <th>AI Time (hrs)</th>
                    <th>Touch-time %</th>
                    <th>Work hrs / referral</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Easy</td>
                    <td>{format(outputData.ai_total_hours.easy)}</td>
                    <td> {inputData.referral_complexity_touch_time_easy}%</td>
                    <td>{format(outputData.ai_work_hours.easy)}</td>
                  </tr>
                  <tr>
                    <td>Moderate</td>
                    <td>{format(outputData.ai_total_hours.moderate)}</td>
                    <td>
                      {inputData.referral_complexity_touch_time_moderate}%
                    </td>
                    <td>{format(outputData.ai_work_hours.moderate)}</td>
                  </tr>
                  <tr>
                    <td>Complex</td>
                    <td>{format(outputData.ai_total_hours.complex)}</td>
                    <td>{inputData.referral_complexity_touch_time_complex}%</td>
                    <td>{format(outputData.ai_work_hours.complex)}</td>
                  </tr>
                  <tr className="table-warning fw-bold">
                    <td>Total</td>
                    <td className="text-success">
                      {format(outputData.ai_total_hours_sum)}
                    </td>
                    <td></td>
                    <td className="text-success">
                      {format(outputData.ai_total_work_hours)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* --- Final Annual Labour Cost Saved Summary --- */}
      {showOutput && (
        <div className="card p-4 shadow mt-5">
          <h4 className="mb-4 text-success fw-bold">
            Annual Labour Cost Saved
          </h4>
          <div className="row row-cols-1 g-3">
            <div className="col">
              <div className="p-3 rounded bg-white border">
                <div className="fw-semibold text-dark">
                  Labor Hours – Baseline
                </div>
                <div className="h5 text-dark mb-0">
                  {format(outputData.labor_hours_baseline)}
                </div>
              </div>
            </div>
            <div className="col">
              <div className="p-3 rounded bg-white border">
                <div className="fw-semibold text-dark">
                  Labor Hours – With KeenStack
                </div>
                <div className="h5 text-dark mb-0">
                  {format(outputData.labor_hours_with_keenstack)}
                </div>
              </div>
            </div>
            <div className="col">
              <div className="p-3 rounded bg-white border">
                <div className="fw-semibold text-dark">
                  Referral Resource Hour Reduction %
                </div>
                <div className="h5 text-dark mb-0">
                  {outputData.hour_reduction_percentage
                    ? Math.round(outputData.hour_reduction_percentage)
                    : 0}
                  %
                </div>
              </div>
            </div>
            <div className="col">
              <div className="p-3 rounded bg-white border">
                <div className="fw-semibold text-dark">
                  Annual Labor Hours Saved
                </div>
                <div className="h5 text-dark mb-0">
                  {format(outputData.annual_labor_hours_saved)}
                </div>
              </div>
            </div>
            <div className="col">
              <div className="p-3 rounded bg-light border-start border-4 border-success">
                <div className="fw-semibold text-success">
                  Annual Labor Cost Saved ($)
                </div>
                <div className="h4 text-dark mb-0">
                  {format(outputData.annual_labor_cost_saved)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="text-start mt-4">
        <button
          className="btn btn-primary btn-lg px-4"
          onClick={handleCalculate}
        >
          Calculate Annual Labour Cost Saved
        </button>
      </div>
    </div>
  );
};

export default Annual_cost_saved;
