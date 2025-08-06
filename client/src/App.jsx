import React from 'react'
import ReferralLicenseForm from './component/ReferralLicenseForm'
import Annual_cost_saved from './component/Annual_cost_saved'
import ReferralAIRevenueImpact from './component/ReferralAIRevenueImpact'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <div>
      <ReferralLicenseForm/>
      <ToastContainer
      position="top-center" // 👈 Center of the screen
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
    
  )
}

export default App