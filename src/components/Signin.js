import React, { useState } from 'react';
import { Form, Col, InputGroup, Row } from 'react-bootstrap';
import { Formik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import * as yup from 'yup';
import axios from 'axios';


function Crea({ onCreaClick }) {

const formatDate = (date) => format(parseISO(date), 'yyyy-MM-dd');
  const schema = yup.object().shape({
    prenom: yup.string().required('Le prénom est requis'),
    nom: yup.string().required('Le nom est requis'),
    age: yup.date().required('La date de naissance est requise'),
    username: yup.string().required('Le nom d\'utilisateur est requis'),
    email: yup.string().email('Email invalide').required('L\'email est requis'),
    mot_de_passe: yup.string().required('Le mot de passe est requis').min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
    confirmation_mot_de_passe: yup.string().oneOf([yup.ref('mot_de_passe'), null], 'Les mots de passe doivent correspondre').required('Confirmez votre mot de passe'),
    terms: yup.bool().required().oneOf([true], 'Vous devez accepter les conditions.'),
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const initialValues = {
    prenom: '',
    nom: '',
    age: '',
    username: '',
    email: '',
    mot_de_passe: '',
    confirmation_mot_de_passe: '',
    terms: false,
    
  };

  const navigate = useNavigate();
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
        // Formater la date avant de l'envoyer
        const formattedDate = formatDate(values.age);

        // Préparer les données à envoyer
        const dataToSend = {
            ...values,
            age: formattedDate,
            is_admin: values.is_admin// Assurez-vous d'envoyer ce champ
        };

        // Envoyer la requête POST
        const response = await axios.post('http://127.0.0.1:8000/register', dataToSend);
        console.log('Response:', response.data);

        // Afficher le message de succès
        setSuccessMessage('Enregistrement réussi');
        setErrorMessage('');
        
        // Optionnel: rediriger l'utilisateur ou mettre à jour l'état de l'application
        setSubmitting(false);
        navigate('/login_page'); // Remplacez '/somewhere' par la route de votre choix après l'inscription
    } catch (error) {
        setSubmitting(false); // Toujours désactiver le state de soumission

        if (error.response) {
            console.error('Error response:', error.response);
            if (error.response.status === 400) {
                setErrorMessage('Erreur: ' + error.response.data.detail);
            } else {
                setErrorMessage('Erreur du serveur: ' + error.response.statusText);
            }
        } else if (error.request) {
            console.error('Error request:', error.request);
            setErrorMessage('Aucune réponse du serveur.');
        } else {
            console.error('Error message:', error.message);
            setErrorMessage('Erreur lors de la configuration de la requête.');
        }

        // Réinitialiser le message de succès
        setSuccessMessage('');
    }
};


  return (
    <div className='creation'>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <Formik
        validationSchema={schema}
        onSubmit={handleSubmit}
        initialValues={initialValues
        }
      >
        {({ handleSubmit, handleChange, values, touched, errors }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Row className="mb-3 justify-content-center">
              <Form.Group as={Col} md="3" controlId="validationFormik01">
                <Form.Label>Prénom</Form.Label>
                <Form.Control
                  type="text"
                  name="prenom"
                  value={values.prenom}
                  onChange={handleChange}
                  isValid={touched.prenom && !errors.prenom}
                  isInvalid={touched.prenom && !!errors.prenom}
                />
                <Form.Control.Feedback type="invalid">{errors.prenom}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="3" controlId="validationFormik02">
                <Form.Label>Nom</Form.Label>
                <Form.Control
                  type="text"
                  name="nom"
                  value={values.nom}
                  onChange={handleChange}
                  isValid={touched.nom && !errors.nom}
                  isInvalid={touched.nom && !!errors.nom}
                />
                <Form.Control.Feedback type="invalid">{errors.nom}</Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3 justify-content-center">
              <Form.Group as={Col} md="6" controlId="validationFormikUsername">
                <Form.Label>Username</Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    aria-describedby="inputGroupPrepend"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    isValid={touched.username && !errors.username}
                    isInvalid={touched.username && !!errors.username}
                  />
                  <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Row>

            <Row className="mb-3 justify-content-center">
              <Form.Group as={Col} md="6" controlId="validationFormikAge">
                <Form.Label>Date de naissance</Form.Label>
                <Form.Control
                  type="date"
                  name="age"
                  value={values.age}
                  onChange={handleChange}
                  isValid={touched.age && !errors.age}
                  isInvalid={touched.age && !!errors.age}
                />
                <Form.Control.Feedback type="invalid">{errors.age}</Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3 justify-content-center">
              <Form.Group as={Col} md="6" controlId="validationFormikEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Email"
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
              <Form.Group as={Col} md="6" controlId="validationFormikPassword">
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Mot de passe"
                  name="mot_de_passe"
                  value={values.mot_de_passe}
                  onChange={handleChange}
                  isValid={touched.mot_de_passe && !errors.mot_de_passe}
                  isInvalid={touched.mot_de_passe && !!errors.mot_de_passe}
                />
                <Form.Control.Feedback type="invalid">{errors.mot_de_passe}</Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3 justify-content-center">
              <Form.Group as={Col} md="6" controlId="validationFormikConfirmPassword">
                <Form.Label>Confirmer votre mot de passe</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirmer votre mot de passe"
                  name="confirmation_mot_de_passe"
                  value={values.confirmation_mot_de_passe}
                  onChange={handleChange}
                  isValid={touched.confirmation_mot_de_passe && !errors.confirmation_mot_de_passe}
                  isInvalid={touched.confirmation_mot_de_passe && !!errors.confirmation_mot_de_passe}
                />
                <Form.Control.Feedback type="invalid">{errors.confirmation_mot_de_passe}</Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3 justify-content-center">
              <Form.Group as={Col} md="6" controlId="validationFormikTerms">
                <div className="mb-3 d-flex align-items-center">
                  <Form.Check
                    required
                    name="terms"
                    label="Accepter les termes et conditions"
                    onChange={handleChange}
                    isInvalid={!!errors.terms}
                    feedback={errors.terms}
                    feedbackType="invalid"
                    id="validationFormikTerms"
                  />
                </div>
              </Form.Group>
            </Row>

            <Row className="mb-3 justify-content-center">
              <div className="text-center">
                <button className="btn btn-outline-success" type="submit" >
                  Créer un compte
                </button>
              </div>
            </Row>

            <Row className="mb-3 justify-content-center">
              <div className="text-center">
                <Link to="/" onClick={onCreaClick}>Annuler</Link>
              </div>
            </Row>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Crea;





