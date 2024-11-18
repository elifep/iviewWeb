import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PersonalInfoFormPage from './pages/PersonalInfoFormPage';
import InterviewFlowPage from './pages/InterviewFlowPage';
import CandidateFlowPage from './pages/CandidateFlowPage'; // Assuming this is your interview page
import SuccessPage from './pages/SuccessPage'; // Assuming this is your interview page

function App() {
    return (
        <Router>
            <Routes>
                {/* Home route can lead to personal info or landing page */}
                <Route path="/" element={<PersonalInfoFormPage />} />
                    {/* Route for applying with a unique interview link */}
                    <Route path="/apply/:uniqueId" element={<CandidateFlowPage />} />

                {/* Route for personal info form */}
                <Route path="/personal-info" element={<PersonalInfoFormPage />} />

                {/* Route for the candidate interview flow after the personal info form */}
                <Route path="/interview" element={<InterviewFlowPage />} />
                <Route path="/success-page" element={<SuccessPage />} />   

            
            </Routes>
        </Router>
    );
}

export default App;
