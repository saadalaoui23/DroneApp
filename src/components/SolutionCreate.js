import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // useParams pour obtenir l'ID de la solution à modifier
import { Form, Button, Container } from 'react-bootstrap';

const SolutionCreateOrEdit = ({ isEditing }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageId, setImageId] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams(); // Récupérer l'ID de la solution si on est en mode édition

    useEffect(() => {
        const isAdmin = localStorage.getItem('is_admin') === 'true';
        if (!isAdmin) {
            navigate('/solutions'); // Rediriger si l'utilisateur n'est pas admin
        }

        // Si on est en mode édition, récupérer les détails de la solution
        if (isEditing && id) {
            fetch(`http://localhost:8000/solutions/${id}`)
                .then(response => response.json())
                .then(data => {
                    setTitle(data.title);
                    setDescription(data.description);
                    setImageId(data.image_id);
                })
                .catch(error => setError("Erreur lors du chargement des données de la solution"));
        }
    }, [id, isEditing, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        const solutionData = {
            title,
            description,
            image_id: parseInt(imageId)
        };

        try {
            const method = isEditing ? 'PUT' : 'POST'; // PUT pour modifier, POST pour créer
            const url = isEditing ? `http://localhost:8000/solutions/${id}` : 'http://localhost:8000/solutions';
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(solutionData),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la création ou de la modification de la solution');
            }

            const data = await response.json();
            setSuccessMessage(isEditing ? 'La solution a été modifiée avec succès.' : 'La solution a été créée avec succès.');
            navigate('/solutions');
        } catch (error) {
            setError(error.message);
        }
    };

    return (<div><div><Button onClick={() => navigate(-1)} className='btn-secondary fs-5 text-center px-2 py-1 rounded-pill' style={{ margin: '3% 0% 3% 7%' }}>Retour</Button>
        </div>
        <Container>
            <h1>{isEditing ? 'Modifier' : 'Créer'} une solution</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="title">
                    <Form.Label>Titre</Form.Label>
                    <Form.Control 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required
                    />
                </Form.Group>

                <Form.Group controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows={3} 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        required
                    />
                </Form.Group>

                <Form.Group controlId="imageId">
                    <Form.Label>ID de l'image</Form.Label>
                    <Form.Control 
                        type="number" 
                        value={imageId} 
                        onChange={(e) => setImageId(e.target.value)} 
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3" style={{ margin: '3% 30% 3% 0%' }}>
                    {isEditing ? 'Modifier' : 'Créer'} la solution
                </Button>
            </Form>

            {error && <p className="text-danger mt-3">{error}</p>}
            {successMessage && <p className="text-success mt-3">{successMessage}</p>}
        </Container></div>
    );
};

export default SolutionCreateOrEdit;


