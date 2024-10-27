import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Spinner, Container, Card, Row, Col, Alert } from 'react-bootstrap';

const UserProfileForm = () => {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    username: '',
    age: '',
    address: '',
    postalCode: '',
    cardNumber: '',
    expirationDate: '',
    cvv: '',
    firstName: '', // Champ pour le prénom du paiement
    lastName: '', // Champ pour le nom de famille du paiement
    dateOfBirth: '', // Champ pour la date de naissance
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:8000/user/details', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Mettre à jour formData avec les informations récupérées
        setFormData({
          prenom: response.data.user.prenom || '',
          nom: response.data.user.nom || '',
          email: response.data.user.email || '',
          username: response.data.user.username || '',
          age: response.data.user.age || '',
          address: response.data.payment_info[0]?.address || '',
          postalCode: response.data.payment_info[0]?.postalcode || '',
          cardNumber: response.data.payment_info[0]?.cardNumber || '',
          expirationDate: response.data.payment_info[0]?.expirationDate || '',
          cvv: response.data.payment_info[0]?.cvv || '',
          firstName: response.data.payment_info[0]?.firstname || '',
          lastName: response.data.payment_info[0]?.lastname || '',
          dateOfBirth: response.data.payment_info[0]?.dateofbirth || '', // Remplir date de naissance
        });
      } catch (error) {
        setError("Erreur lors de la récupération des informations.");
        console.error("Erreur lors de la récupération des informations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.put('http://localhost:8000/user/update-info', {
        user_update: {
          prenom: formData.prenom,
          nom: formData.nom,
          email: formData.email,
          username: formData.username,
          age: formData.age,
        },
        payment_update: {
          address: formData.address,
          postalCode: formData.postalCode,
          cardNumber: formData.cardNumber,
          expirationDate: formData.expirationDate,
          cvv: formData.cvv,
          firstName: formData.firstName,
          lastName: formData.lastName,
          dateOfBirth: formData.dateOfBirth, // Ajouter la date de naissance au paiement
        }
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate('/client_page');
    } catch (error) {
      setError("Erreur lors de la mise à jour des informations");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow">
        <Card.Header as="h2" className="text-center mb-4" style={{fontFamily: 'Wittgenstein'  }}>Modifier les informations personnelles</Card.Header>
        
        {loading && (
          <div className="text-center my-3">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}

        {error && <Alert variant="danger" className="text-center">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Prénom</Form.Label>
                <Form.Control
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nom</Form.Label>
                <Form.Control
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nom d'utilisateur</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Date de naissance</Form.Label>
                <Form.Control
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Adresse</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Code postal</Form.Label>
                <Form.Control
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Numéro de carte</Form.Label>
                <Form.Control
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Date d'expiration</Form.Label>
                <Form.Control
                  type="text"
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>CVV</Form.Label>
                <Form.Control
                  type="number"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="text-center d-flex flex-column align-items-center justify-content-center">
            <button  className='btn btn-outline-success m-2 p-2' style={{fontFamily: 'Wittgenstein'  }}> 
              Sauvegarder les modifications
            </button>
            <Button variant="secondary" onClick={()=>navigate(-1)} style={{fontFamily: 'Wittgenstein'  }}>
              Retour
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};
export default UserProfileForm;