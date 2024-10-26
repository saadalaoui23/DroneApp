import React, { useEffect, useState } from 'react';
import { Form, Col, InputGroup, Row } from 'react-bootstrap';
import { Formik } from 'formik';
import { useLocation, useNavigate,useParams} from 'react-router-dom';
import { format, parse } from 'date-fns';
import InputMask from 'react-input-mask'; 
import * as yup from 'yup';
import axios from 'axios';
import { useAuth } from './AuthContext';

function Checkout({ user }) {
  const navigate = useNavigate(); 
  const location = useLocation();
  const { id } = useParams();
  const { title, price} = location.state || {};
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { isAuthenticated, loading } = useAuth();
  const [offers, setOffers] = useState([]); 
  const [userInfo, setUserInfo] = useState(null);  // Nouvelle variable pour stocker les infos utilisateur

  useEffect(() => {
    if (!loading) { 
        if (!isAuthenticated) {
            navigate('/login_page?redirectTo=/checkout');
        } else {
            fetchOffers();
            fetchUserInfo(); // Appel pour charger les infos de l'utilisateur
        }
    }
  }, [isAuthenticated, loading, navigate]);

  const fetchOffers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/abonnements'); 
      setOffers(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des offres', error);
      setErrorMessage('Erreur lors du chargement des offres. Veuillez réessayer.');
    }
  };

  // Nouvelle fonction pour récupérer les informations de l'utilisateur
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/user/payment-info', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserInfo(response.data);  // Stocke les informations de l'utilisateur
    } catch (error) {
      console.error('Erreur lors du chargement des infos utilisateur', error);
      setErrorMessage('Erreur lors du chargement des informations utilisateur.');
    }
  };

  const formatExpirationDate = (date) => {
    let formattedDate;
    if (/^(0[1-9]|1[0-2])\/\d{2}$/.test(date)) {
      formattedDate = date.replace('/', ''); 
    } else {
      const parsedDate = parse(date, 'MMYY', new Date());
      formattedDate = format(parsedDate, 'MMyy'); 
    }
    return formattedDate;
  };

  const initialValues = userInfo
    ? {
        firstName: userInfo.prenom,
        lastName: userInfo.nom,
        dateOfBirth: userInfo.age, // Ce champ n'est pas fourni, vous pouvez l'ajouter si nécessaire
        username: userInfo.username,
        email: userInfo.email,
        password: '',  // Mot de passe à remplir par l'utilisateur
        address: userInfo.address,
        postalCode: userInfo.postalCode,
        cardNumber: '',
        expirationDate: '',
        cvv: '',
        terms: false,
        selectedOffer: title, // Utilisez le titre de l'abonnement ici
        selectedPrice: price,
      }
    : {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        username: '',
        email: '',
        password: '',
        address: '',
        postalCode: '',
        cardNumber: '',
        expirationDate: '',
        cvv: '',
        terms: false,
        selectedOffer: '',
        selectedPrice: '',
      };

  const schema = yup.object().shape({
    firstName: yup.string().required('Le prénom est requis'),
    lastName: yup.string().required('Le nom est requis'),
    dateOfBirth: yup.date().required('La date de naissance est requise'),
    username: yup.string().required('Le nom d\'utilisateur est requis'),
    email: yup.string().email('Email invalide').required('L\'email est requis'),
    password: yup.string().required('Le mot de passe est requis').min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
    address: yup.string().required('Adresse requise'),
    postalCode: yup.string().required('Code postal requis'),
    cardNumber: yup.string().matches(/^\d{16}$/, 'Numéro de carte requis').required('Numéro de carte requis'),
    expirationDate: yup.string()
      .matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Date d\'expiration invalide')
      .required('Date d\'expiration requise'),
    cvv: yup.string().matches(/^\d{3}$/, 'CVV requis').required('CVV requis'),
    terms: yup.bool().required().oneOf([true], 'Vous devez accepter les conditions.'),
    selectedOffer: yup.string().required('Veuillez sélectionner une offre.'),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);

    try {
        const formattedDate = formatExpirationDate(values.expirationDate);
        const token = localStorage.getItem('token'); 

        const response = await axios.post(
            `http://127.0.0.1:8000/payment`, 
            {
                ...values,
                cardNumber: String(values.cardNumber),  // Convertir en chaîne
                cvv: String(values.cvv),  // Convertir en chaîne
                expirationDate: formattedDate,
                abonnement_id: id,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        setSuccessMessage('Paiement réussi !');
        navigate('/home_page_client');
    } catch (error) {
        setErrorMessage('Erreur lors du paiement. Veuillez réessayer.');
        console.error(error);  // Voir le message d'erreur dans la console
    } finally {
        setSubmitting(false);
    }
};




  
return (
    <div className="bg4 d-flex flex-column align-items-center justify-content-center">
  <h1 className="T5">Devenir membre premium</h1>
  <div className='paiement'>
    {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <Formik
                validationSchema={schema}
                onSubmit={handleSubmit} 
                initialValues={initialValues}
                enableReinitialize={true}
            >
                {({ handleSubmit, handleChange, values, touched, errors }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Row className="mb-3 justify-content-center">
                            <Form.Group as={Col} md="4" controlId="validationFormik01">
                                <Form.Label>Prénom</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="firstName"
                                    value={values.firstName}
                                    onChange={handleChange}
                                    isValid={touched.firstName && !errors.firstName}
                                    isInvalid={touched.firstName && !!errors.firstName}
                                />
                                <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} md="4" controlId="validationFormik02">
                                <Form.Label>Nom</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="lastName"
                                    value={values.lastName}
                                    onChange={handleChange}
                                    isValid={touched.lastName && !errors.lastName}
                                    isInvalid={touched.lastName && !!errors.lastName}
                                />
                                <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
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
                            <Form.Group as={Col} md="6" controlId="validationFormik03">
                                <Form.Label>Date de Naissance</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="dateOfBirth"
                                    value={values.dateOfBirth}
                                    onChange={handleChange}
                                    isValid={touched.dateOfBirth && !errors.dateOfBirth}
                                    isInvalid={touched.dateOfBirth && !!errors.dateOfBirth}
                                />
                                <Form.Control.Feedback type="invalid">{errors.dateOfBirth}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3 justify-content-center">
                            <Form.Group as={Col} md="6" controlId="validationFormik04">
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
                            <Form.Group as={Col} md="6" controlId="validationFormik05">
                                <Form.Label>Mot de passe</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Mot de passe"
                                    name="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    isValid={touched.password && !errors.password}
                                    isInvalid={touched.password && !!errors.password}
                                />
                                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3 justify-content-center">
                            <Form.Group as={Col} md="6" controlId="validationFormik09">
                                <Form.Label>Adresse</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Adresse"
                                    name="address"
                                    value={values.address}
                                    onChange={handleChange}
                                    isValid={touched.address && !errors.address}
                                    isInvalid={touched.address && !!errors.address}
                                />
                                <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3 justify-content-center">
                            <Form.Group as={Col} md="6" controlId="validationFormik10">
                                <Form.Label>Code Postal</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Code Postal"
                                    name="postalCode"
                                    value={values.postalCode}
                                    onChange={handleChange}
                                    isValid={touched.postalCode && !errors.postalCode}
                                    isInvalid={touched.postalCode && !!errors.postalCode}
                                />
                                <Form.Control.Feedback type="invalid">{errors.postalCode}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3 justify-content-center">
                            <Form.Group as={Col} md="4" controlId="validationFormik06">
                                <Form.Label >Numéro de Carte</Form.Label>
                                <Form.Control 
                                    type="number"
                                    placeholder="Numéro de Carte"
                                    name="cardNumber"
                                    maxLength={16}
                                    value={values.cardNumber}
                                    onChange={handleChange}
                                    isValid={touched.cardNumber && !errors.cardNumber}
                                    isInvalid={touched.cardNumber && !!errors.cardNumber}
                                />
                                <Form.Control.Feedback type="invalid">{errors.cardNumber}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} md="2" controlId="validationFormik07">
  <Form.Label>Expiration</Form.Label>
  <InputMask
    mask="99/99"
    maskChar={null}
    value={values.expirationDate}
    onChange={handleChange}
  >
    {(inputProps) => (
      <Form.Control
        {...inputProps}
        type="text"
        placeholder="MM/YY"
        name="expirationDate"
        isValid={touched.expirationDate && !errors.expirationDate}
        isInvalid={touched.expirationDate && !!errors.expirationDate}
      />
    )}
  </InputMask>
  <Form.Control.Feedback type="invalid">
    {errors.expirationDate}
  </Form.Control.Feedback>
</Form.Group>


                            <Form.Group as={Col} md="2" controlId="validationFormik08">
                                <Form.Label>CVV</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="CVV"
                                    name="cvv"
                                    maxLength={3}
                                    value={values.cvv}
                                    onChange={handleChange}
                                    isValid={touched.cvv && !errors.cvv}
                                    isInvalid={touched.cvv && !!errors.cvv}
                                />
                                <Form.Control.Feedback type="invalid">{errors.cvv}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3 justify-content-center">
                <Form.Group as={Col} md="6" controlId="validationFormikSelect">
                <div style={{ border: '1px solid #ccc', padding: '10px', margin: '20px 0', borderRadius: '8px' }}>
        <p><strong>Offre sélectionnée : </strong>{initialValues.selectedOffer}</p>
        <p><strong>Prix : </strong>{initialValues.selectedPrice} €</p>
      </div>


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
                                        id="validationFormik0"
                                    />
                                </div>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3 justify-content-center">
                            <div className="text-center">
                                <button className="btn btn-outline-success" type="submit">
                                    Valider le paiement
                                </button>
                            </div>
                        </Row>

                        <Row className="mb-3 justify-content-center">
                        <button
            type="button"
            onClick={() => navigate('/home_page_client')} // Redirige vers la page d'accueil
            className="btn btn-link"
        >
            Annuler
        </button>
                        </Row>
                    </Form>
                )}
            </Formik>
        </div>
        </div>
    );
};

export default Checkout;