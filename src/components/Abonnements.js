import React, { useEffect, useState } from 'react'; 
import { Button, Container, Card, Col, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; 

const Abonnements = () => {
    const [error, setError] = useState(null);
    const [abonnements, setAbonnements] = useState([]);
    const [abonnementToDelete, setAbonnementToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigate = useNavigate();
    const isAdmin = localStorage.getItem('is_admin') === 'true'; // Vérifier si l'utilisateur est admin
    const { isAuthenticated, loading } = useAuth();

    // Récupérer les abonnements depuis le backend
    const fetchAbonnements = async () => {
        try {
            const response = await fetch('http://localhost:8000/abonnements');
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des abonnements');
            }
            const data = await response.json();
            setAbonnements(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDeleteAbonnement = (id) => {
        setAbonnementToDelete(id);
        setShowDeleteModal(true); // Afficher la modale de confirmation de suppression
    };

    const confirmDeleteAbonnement = async () => {
        try {
            const response = await fetch(`http://localhost:8000/abonnements/${abonnementToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Erreur lors de la suppression de l\'abonnement');
            }
            setAbonnements(abonnements.filter(abonnement => abonnement.id !== abonnementToDelete));
            setShowDeleteModal(false); // Fermer la modale après suppression
        } catch (error) {
            setError(error.message);
        }
    };

    const editAbonnement = (id) => {
        navigate(`/abonnements/edit/${id}`);
    };
    const handleAbonnementClick = (abonnement) => {
        if (!loading) { 
          if (isAuthenticated) {
            // Redirection vers la page de paiement avec l'abonnement sélectionné (titre et prix)
            navigate(`/checkout/${abonnement.id}`, { state: { title: abonnement.title, price: abonnement.price } });
          } else {
            // Redirection vers la page de connexion avec redirection vers le checkout
            navigate(`/login_page?redirect=/checkout/${abonnement.id}`);
          }
        }
      };
      
    useEffect(() => {
        fetchAbonnements();
    }, []);

    return (
        <div>
            <div>
                <Button onClick={() => navigate(-1)} className='btn-secondary fs-5 text-center px-2 py-1 rounded-pill' style={{ margin: '3% 0% 0% 7%',fontFamily: 'Wittgenstein'  }}>Retour</Button>
                <h1 className='T6 text-center'>Abonnements disponibles</h1>
            </div>

            <Container className='d-flex flex-wrap justify-content-center'>
                {abonnements.length > 0 ? (
                    abonnements.map(abonnement => (
                        <Card key={abonnement.id} className='shadow-sm border-light rounded m-3' style={{ backgroundColor: 'rgba(6, 48, 2, 0.05)', flex: '1 0 30%' }}>
                            <Card.Body className='Abonnement d-flex flex-column'>
                                <h3 className='text-center my-3' style={{ fontFamily: 'Wittgenstein' }}>{abonnement.title}</h3>
                                <Card.Text className='flex-grow-1'>{abonnement.description}</Card.Text>
                                <Card.Text className='fw-bold'>Prix: {abonnement.price} €</Card.Text>

                                {abonnement.user_id !== null && (
                                    <Card.Text>ID Utilisateur: {abonnement.user_id}</Card.Text>
                                )}
                                {abonnement.payment_info_id !== null && (
                                    <Card.Text>ID Info de Paiement: {abonnement.payment_info_id}</Card.Text>
                                )}
                                {isAdmin && (
                                    <div className='d-flex justify-content-around'>
                                        <Button variant="primary" onClick={() => editAbonnement(abonnement.id)} className='flex-fill me-1' style={{ fontFamily: 'Wittgenstein' }}>Modifier</Button>
                                        <Button variant="danger" onClick={() => handleDeleteAbonnement(abonnement.id)} className='flex-fill ms-1' style={{ fontFamily: 'Wittgenstein' }}>Supprimer</Button>
                                    </div>
                                )}
                                <Button
                                    variant="success"
                                    onClick={() => handleAbonnementClick(abonnement)}
                                    className='mt-3'
                                    style={{ fontFamily: 'Wittgenstein' }}
                                >
                                    S'abonner
                                </Button>
                            </Card.Body>
                        </Card>
                    ))
                ) : (
                    <p className='text-center'>Aucun abonnement disponible.</p>
                )}
            </Container>

            {/* Modale de confirmation de suppression */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmer la suppression</Modal.Title>
                </Modal.Header>
                <Modal.Body>Êtes-vous sûr de vouloir supprimer cet abonnement ?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="danger" onClick={confirmDeleteAbonnement}>
                        Supprimer
                    </Button>
                </Modal.Footer>
            </Modal>

            {error && <p className="text-danger text-center">{error}</p>}
            {isAdmin && (
                <div className="text-center">
                    <Button variant="success" onClick={() => navigate('/abonnements/create')} style={{ padding: '1.5% 2%', fontFamily: 'Wittgenstein', margin: '10% 0%' }}>
                        Ajouter un nouvel abonnement
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Abonnements;








    