import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card, Container, Row, Col,Spinner } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext"; // Assurez-vous d'importer votre AuthContext
import UserProfileForm from './UserProfileForm';

const Client_Page = () => {
  const { isAuthenticated, loading } = useAuth(); // Récupération de l'état d'authentification
  const [userInfo, setUserInfo] = useState(null); // État pour stocker les informations de l'utilisateur
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialiser useNavigate

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token"); // Récupérer le token depuis localStorage

      if (!token) {
        console.error("Token manquant");
        navigate('/login_page'); // Redirection vers la page de connexion si le token est manquant
        return;
      }

      const response = await axios.get('http://localhost:8000/user/details', {
        headers: { Authorization: `Bearer ${token}` }, // Ajouter le token dans les headers
      });

      setUserInfo(response.data); // Stocker les données utilisateur
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setError("Token invalide ou expiré. Veuillez vous reconnecter.");
          navigate('/login_page'); // Redirection vers la page de connexion en cas d'erreur 401
        } else {
          setError("Erreur lors de la récupération des informations de l'utilisateur");
          console.error("Erreur lors de la récupération des informations de l'utilisateur:", error);
        }
      } else {
        setError("Erreur de connexion au serveur");
        console.error("Erreur de connexion au serveur:", error);
      }
    }
  };


  useEffect(() => {
    if (isAuthenticated && !loading) {
      fetchUserInfo(); // Récupérer les informations de l'utilisateur si authentifié
    } else if (!isAuthenticated && !loading) {
      navigate('/login'); // Redirection vers la page de connexion si non authentifié
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>;
  }

  if (error) {
    return <div className="alert alert-danger">Erreur: {error}</div>;
  }

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow">
        <Card.Header as="h2" className="text-center mb-4" style={{fontFamily: 'Wittgenstein'  }}>Informations de l'utilisateur</Card.Header>
        
        {userInfo ? (
          <>
            <Row className="mb-4">
              <Col md={6}>
                <h5 style={{fontFamily: 'Wittgenstein'  }}>Informations Personnelles</h5>
                <p><strong>Prénom :</strong> {userInfo.user.prenom}</p>
                <p><strong>Nom :</strong> {userInfo.user.nom}</p>
                <p><strong>Nom d'utilisateur :</strong> {userInfo.user.username}</p>
                <p><strong>Email :</strong> {userInfo.user.email}</p>
                <p><strong>Date de naissance :</strong> {userInfo.user.age}</p>
              </Col>
              
              <Col md={6}>
                {userInfo.payment_info.length > 0 ? (
                  <ul className="list-unstyled">
                    {userInfo.payment_info.map((payment) => (
                      <li key={payment.id} className="mb-3">
                        <p><strong>Adresse :</strong> {payment.address}</p>
                        <p><strong>Code postal :</strong> {payment.postalcode}</p>
                        <p><strong>Numéro de carte :</strong> **** **** **** {payment.cardnumber.slice(-4)}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Aucune information de paiement disponible.</p>
                )}
              </Col>
            </Row>

            <div className="text-center d-flex flex-column align-items-center justify-content-center">
              <button 
                className='btn btn-outline-success m-2 p-2'
                onClick={() => navigate('/user/profile')}
                style={{fontFamily: 'Wittgenstein'  }}
              >
                Modifier les informations personnelles
              </button>
              <Button variant="secondary" onClick={()=>navigate(-1)} style={{fontFamily: 'Wittgenstein'  }}>
              Retour
            </Button>
          </div>
          </>
        ) : (
          <p className="text-center">Aucune information disponible.</p>
        )}
      </Card>
    </Container>
  );
};

export default Client_Page;