/* eslint-disable */
import "./App.css";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import 'primeicons/primeicons.css';
import Columns from "./Components/Columns/Columns";
import Home from './Components/Home/Home'
import PatientID from "./Components/Patient_ID/PatientID";
import Pheno from './Components/Phenotype/Phenotype'
import Dashboard from "./Components/Dash_new/dashboard";
import Rreport from "./Components/Report/Repport";
import Form from './Components/Login/Form/Form'
import Preferences from './Components/Preferences/Preferences'
import { GoogleOAuthProvider } from '@react-oauth/google';
import ProtectedRoute from "./Components/ProtectedRoute/Protectedroute";
function App(){
  return (

    <div className="App">
      <GoogleOAuthProvider clientId="495587796363-prf3o1372ce2e1bf67cflu7kn4h0hdrg.apps.googleusercontent.com">
      <Router>
       <Routes>
       <Route path="/" element={<Form/>}/>
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
       <Route path="/home" element={<ProtectedRoute><Home/></ProtectedRoute>}/>
       {/* <Route path="/pdf_view" element={<ProtectedRoute><Pheno/></ProtectedRoute>}/> */}
       {/* <Route path="/patient_id" element={<ProtectedRoute><PatientID/></ProtectedRoute>}/> */}
       <Route path="/columns_selection" element={<ProtectedRoute><Columns/></ProtectedRoute>}/>
       {/* <Route path="/conditions" element={<ProtectedRoute><Preferences/></ProtectedRoute>}/> */}
        <Route path="/ss" element={<Rreport/>}/>
       </Routes>
      </Router>
      </GoogleOAuthProvider>

    </div>
  )
}
export default App;