import React, { useEffect, useState } from 'react';
import { Button, Container, Card, Col, Modal  } from "react-bootstrap";
import { useNavigate,useParams } from 'react-router-dom';
import CARTE from '../images/CARTE.jpg';
import MOD from '../images/MOD.jpg'
import CO from '../images/CO.jpg'
import PLAN from '../images/PLAN.jpg'
import VOL from '../images/VOL.jpg'
import ANALY from '../images/ANALY.jpg'

const Solutions = () => {
    const [error, setError] = useState(null);
    const [solutions, setSolutions] = useState([]);
    const [solutionToDelete, setSolutionToDelete] = useState(null); // Pour suivre quelle solution est en cours de suppression
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigate = useNavigate();
    const isAdmin = localStorage.getItem('is_admin') === 'true';  // Vérifier si l'utilisateur est admin
    const { solutionId } = useParams();

    // Images statiques associées par leur ID
    const images = [
        { id: 1, src: CARTE },
        { id: 2, src: MOD },
        { id: 3, src: PLAN },
        { id: 4, src: ANALY },
        { id: 5, src: CARTE },
        { id: 6, src: CO },
        { id: 7, src: VOL},
    ];

    const fetchSolutions = async () => {
        try {
            const response = await fetch('http://localhost:8000/solutions');
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des solutions');
            }
            const data = await response.json();
            console.log('Solutions data:', data);
            if (data && Array.isArray(data)) {
                setSolutions(data);
            } else {
                throw new Error('La réponse de l\'API ne contient pas une liste valide de solutions');
            }
        } catch (error) {
            setError(error.message);
            console.error('Error fetching solutions:', error);
        }
    };

    const handleDeleteSolution = (id) => {
        setSolutionToDelete(id);
        setShowDeleteModal(true); // Afficher la modale de confirmation
    };

    const confirmDeleteSolution = async () => {
        try {
            const response = await fetch(`http://localhost:8000/solutions/${solutionToDelete}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Erreur lors de la suppression de la solution');
            }
            setSolutions(solutions.filter(solution => solution.id !== solutionToDelete));
            setShowDeleteModal(false); // Fermer la modale après suppression
        } catch (error) {
            setError(error.message);
        }
    };

    const editSolution = (id) => {
        navigate(`/solutions/edit/${id}`);
    };


    useEffect(() => {
        fetchSolutions();
    }, []);

    const getImageBySolutionId = (solutionId) => {
        const image = images.find(img => img.id === solutionId);
        return image ? image.src : 'default-image.jpg';
    };

    useEffect(() => {
        // Si un ID de solution est présent dans l'URL, faire défiler vers cet élément
        if (solutionId) {
            const element = document.getElementById(`service-${solutionId}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [solutionId]);

    return (
        <div>
            <div>
                <Button onClick={() => navigate(-1)} className='btn-secondary fs-5 text-center px-2 py-1 rounded-pill' style={{ margin: '3% 0% 0% 7%',fontFamily: 'Wittgenstein'  }}>Retour</Button>
                <h1 className='T3'>Solutions proposées</h1>
            </div>
            <Container>
                {solutions.length > 0 ? (
                    solutions.map(solution => (
                        <Col key={solution.id} className='d-flex flex-column align-items-center justify-content-center'>
                            <h1 className='T4 text-center my-3'>{solution.title}</h1>
                            <Card className='SOL-card' id={`service-${solution.id}`}>
                                <Card.Img className='sol-img' variant="top" src={getImageBySolutionId(solution.image_id)} alt={solution.title} />
                                <Card.Body>
                                    <Card.Text>{solution.description}</Card.Text>
                                    {isAdmin && (
                                        <div className='d-flex  align-items-center justify-content-around'>
                                            <Button variant="primary" onClick={() => editSolution(solution.id)} style={{fontFamily:'Wittgenstein'}}>Modifier</Button>
                                            <Button variant="danger" onClick={() => handleDeleteSolution(solution.id)} style={{fontFamily:'Wittgenstein'}}>Supprimer</Button>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p>Aucune solution disponible</p>
                )}
            </Container>
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>Êtes-vous sûr de vouloir supprimer cette solution ?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)} style={{fontFamily:'Wittgenstein'}}>Annuler</Button>
                    <Button variant="danger" onClick={confirmDeleteSolution} style={{fontFamily:'Wittgenstein'}}>Confirmer la suppression</Button>
                </Modal.Footer>
            </Modal>
            {error && <div className="error">{error}</div>}
            {isAdmin && (
                <div className="text-center">
                    <Button  variant="success" onClick={() => navigate('/solutions/create')} style={{padding:'1.5% 2% 1.5% 2% ', fontFamily:'Wittgenstein'}}>Ajouter une nouvelle solution</Button>
                </div>
            )}
        </div>
    );
};

export default Solutions;



