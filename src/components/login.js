import React, { useState, useEffect} from 'react';
import axios from 'axios';
import * as yup from 'yup';
import { Form, Col, Row } from 'react-bootstrap';
import { Formik } from 'formik';
import { useNavigate, Link, useLocation} from 'react-router-dom';
import { useAuth } from './AuthContext';

const Login = () => {
  const { login } = useAuth(); // Contexte pour gérer l'état de connexion
  const schema = yup.object().shape({
    email: yup.string().email('Email invalide').required('L\'email est requis'),
    mot_de_passe: yup.string().required('Le mot de passe est requis'),
  });

  const [initialValues, setInitialValues] = useState({
    email: '',
    mot_de_passe: '',
    rememberMe: false,
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    if (savedEmail) {
      setInitialValues(prevValues => ({
        ...prevValues,
        email: savedEmail,
        rememberMe: true,
      }));
    }
  }, []);

  const navigate = useNavigate();
  const location = useLocation(); 
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
        console.log("Email envoyé:", values.email);
        console.log("Mot de passe envoyé:", values.mot_de_passe);

        const response = await axios.post('http://127.0.0.1:8000/login', {
            email: values.email,
            mot_de_passe: values.mot_de_passe,
        });
        
        // Vérifie que tu reçois bien un "access_token" dans la réponse
        if (response.data.access_token) {
            console.log("Token reçu:", response.data.access_token);
            // Stocker le token et le statut admin dans le localStorage
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('is_admin', response.data.is_admin); // Ajouter cette ligne

            // Appel de la fonction login pour mettre à jour l'état de connexion
            login();

            setErrorMessage('');
            setSubmitting(false);

            // Sauvegarder l'email si 'Remember Me' est coché
            if (values.rememberMe) {
                localStorage.setItem('email', values.email);
            } else {
                localStorage.removeItem('email');
            }

            // Redirection après connexion
            const redirectTo = new URLSearchParams(location.search).get('redirectTo');
            if (response.data.is_admin) {
                navigate('/home_page_client'); // Rediriger vers le tableau de bord administrateur
            } else {
                navigate(redirectTo || '/home_page_client'); // Rediriger vers la page client
            }
        } else {
            setErrorMessage('Problème lors de la connexion, aucun token reçu');
        }
        
    } catch (error) {
        console.log("Erreur attrapée:", error.response ? error.response.data : error.message);
        setErrorMessage('Email ou mot de passe incorrect');
        setSubmitting(false);
    }
};


  return (
    <Formik
      validationSchema={schema}
      onSubmit={handleSubmit}
      initialValues={initialValues}
    >
      {({ handleSubmit, handleChange, values, touched, errors }) => (
        <div className='d-flex flex-column justify-content-center align-items-center'>
          <h1 className="P_C text-center mx-5"><br />Page de Connexion</h1>
          {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
          <Form className="form_connexion" noValidate onSubmit={handleSubmit}>
            <Row className="mb-3 justify-content-center">
              <Form.Group as={Col} md="8" style={{ margin: '4% 0% 0% 0%' }} controlId="validationFormik04">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder=""
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  isValid={touched.email && !errors.email}
                  isInvalid={touched.email && !!errors.email}
                />
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3 justify-content-center">
              <Form.Group as={Col} md="8" controlId="validationFormik05">
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control
                  type="password"
                  placeholder=""
                  name="mot_de_passe"
                  value={values.mot_de_passe}
                  onChange={handleChange}
                  isValid={touched.mot_de_passe && !errors.mot_de_passe}
                  isInvalid={touched.mot_de_passe && !!errors.mot_de_passe}
                />
                <Form.Control.Feedback type="invalid">{errors.mot_de_passe}</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <div className="mb-5 d-flex flex-row justify-content-center align-items-start">
              <Form.Group controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Remember Me" />
              </Form.Group>
              <Row className="mb-5" md="8" style={{ margin: '0% 0% 0% 1%' }}>
                <Link to='forget_password'>mot de passe oublié</Link>
              </Row>
            </div>
            <div className="d-flex flex-column justify-content-center align-items-center">
              <Row className="mb-3 justify-content-center">
                <button  className='btn btn-outline-success' type='submit' style={{ padding: '12px', width: '12vw' }}>se connecter</button>
              </Row>
              <Row className="mb-3 justify-content-center">
                <button onClick={() => navigate(-1)} className='btn btn-outline-success' style={{ width: '8vw' }}>Retour</button>
              </Row>
              <Row className="mb-3 justify-content-center" md="8">
                <div className="text-center">
                  <Link to='register_page'>Première visite? Créer un compte</Link>
                </div>
              </Row>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default Login;


