import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import Login_Page from './Pages/Login_Page';
import Register_Page from './Pages/Register_Page';
import Home_visitor from './Pages/home_page_visitor';
import Home_client from './Pages/home_page_client';
import Forget_Password from './Pages/forget_pasword';
import Client_dashboard from './Pages/dashboard';
import Page_Solutions from './Pages/SOL';
import NoPage from './Pages/NoPage';
import Paiement from './Pages/Paiement';
import 'bootstrap/dist/css/bootstrap.min.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './App.css';
import './Solution.css';
import Support from './components/support';
import Abonnements from './components/Abonnements';
import SolutionCreateOrEdit from './components/SolutionCreate';
import AbonnementCreateOrEdit from './components/AbonnementsCreate';
import Solutions from './components/Solutions';
import Dashboard from './Pages/dashboard';
import Client_Page from './Pages/Client_Page';
import UserProfileForm from './Pages/UserProfileForm';


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth(); // Ajout du "loading"

  if (loading) {
    return <div>Chargement...</div>; // Affiche un indicateur pendant la vérification
  }

  if (!isAuthenticated) {
    return <Navigate to="/login_page" />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Routes publiques */}
          <Route index element={<Home_visitor />} />
          <Route path='/home_guest' element={<Home_visitor />} />
          <Route path='/home_guest/login_page' element={<Login_Page />} />
          <Route path='/login_page' element={<Login_Page />} />
          <Route path='/login_page/register_page' element={<Register_Page />} />
          <Route path='/register_page' element={<Register_Page />} />
          <Route path='/forget_password' element={<Forget_Password />} />
          <Route path='/solutions' element={<Page_Solutions />} />
          <Route path='/solutions/:serviceId' element={<Page_Solutions />} />
          <Route path='/support' element={<Support />} />
          <Route path='/home_guest/support' element={<Support />} />


          {/* Routes protégées */}
          <Route
            path='/home_page_client'
            element={
              <ProtectedRoute>
                <Home_client />
              </ProtectedRoute>
            }
          />
          <Route
            path='/dashboard'
            element={
              <ProtectedRoute>
                <Client_dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path='/checkout'
            element={
              <ProtectedRoute>
                <Paiement />
              </ProtectedRoute>
            }
          />
          <Route
            path='/client_page'
            element={
              <ProtectedRoute>
                <Client_Page />
              </ProtectedRoute>
            }
          />
          <Route
            path='/user/profile'
            element={
              <ProtectedRoute>
                <UserProfileForm />
              </ProtectedRoute>
            }
          />
          <Route
            path='/home_page_client/support'
            element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            }
          />
          <Route
            path='Abonnements/create'
            element={
              <ProtectedRoute>
                <AbonnementCreateOrEdit />
              </ProtectedRoute>
            }
          />
          <Route path='/Abonnements/edit/:id'
           element={
            <ProtectedRoute>
           <AbonnementCreateOrEdit  isEditing={true} />
           </ProtectedRoute>
          }
          />
          <Route
            path='solutions/create'
            element={
              <ProtectedRoute>
                <SolutionCreateOrEdit />
              </ProtectedRoute>
            }
          />
          
          <Route path='/solutions/edit/:id'
           element={
            <ProtectedRoute>
           <SolutionCreateOrEdit isEditing={true} />
           </ProtectedRoute>
          }
          />
          <Route
            path='/Abonnements'
            element={
              <ProtectedRoute>
                <Abonnements />
              </ProtectedRoute>
            }
          />
          <Route
            path='/solutions'
            element={
              <ProtectedRoute>
                <Solutions />
              </ProtectedRoute>
            }
          />
          <Route
            path='/dashboard'
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path='/checkout/:id'
            element={
              <ProtectedRoute>
                <Paiement />
              </ProtectedRoute>
            }
          />

          {/* Route 404 - Page non trouvée */}
          <Route path='*' element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;



