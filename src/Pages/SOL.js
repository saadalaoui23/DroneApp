import { useContext, useState, useEffect } from 'react';
import Solutions from "../components/Solutions";
import {Button} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import AuthContext from "../components/AuthContext";
const Page_Solutions=()=>{
    const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);  // Ajoutez un état pour suivre le chargement

  // Simule une vérification de l'authentification avant d'autoriser la navigation
  useEffect(() => {
    // Suppose qu'une vérification d'authentification a lieu ici (peut-être un appel API, etc.)
    const checkAuthStatus = async () => {
      setLoading(false); // Une fois la vérification terminée, on arrête le chargement
    };
    checkAuthStatus();
  }, []);

  const handleSubscriptionClick = () => {
    // Si la vérification est toujours en cours, on ne fait rien
    if (loading) return;

    // Vérifiez si l'utilisateur est connecté
    if (!isAuthenticated) {
      // Si l'utilisateur n'est pas connecté, redirigez-le vers la page de connexion
      navigate('/login_page');
    } else {
      // Si l'utilisateur est connecté, redirigez-le vers la page d'abonnement
      navigate('/Abonnements');
    }
  };
    return(<>
    <Solutions/>
    <div className='achetez sticky-bottom '>
            <Button onClick={handleSubscriptionClick} className=' btn-warning fs-1 text-center my-4 px-5 py-2 rounded-pill' style={{fontFamily: 'Wittgenstein'}} >Achetez Maintenant {'>'}</Button>
            </div>
            </>
            )
            };
export default Page_Solutions;