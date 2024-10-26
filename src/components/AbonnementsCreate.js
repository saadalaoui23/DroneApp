import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';

const AbonnementCreateOrEdit = ({ isEditing }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [prix, setPrix] = useState('');
    const [startDate, setStartDate] = useState(''); // Nouveau champ start_date
    const [endDate, setEndDate] = useState(''); // Nouveau champ end_date
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const isAdmin = localStorage.getItem('is_admin') === 'true';
        if (!isAdmin) {
            navigate('/abonnements');
        }

        if (isEditing && id) {
            fetch(`http://localhost:8000/abonnements/${id}`)
                .then(response => response.json())
                .then(data => {
                    setTitle(data.title);
                    setDescription(data.description);
                    setPrix(data.price);
                    setStartDate(data.start_date); // Remplir start_date depuis l'API
                    setEndDate(data.end_date); // Remplir end_date depuis l'API
                })
                .catch(error => setError("Erreur lors du chargement des données de l'abonnement"));
        }
    }, [id, isEditing, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        const abonnementData = {
            title,
            description,
            price: prix, // Harmonisé avec le backend (string)
            start_date: startDate, // Inclus start_date
            end_date: endDate, // Inclus end_date
        };

        try {
            const method = isEditing ? 'PUT' : 'POST';
            const url = isEditing ? `http://localhost:8000/abonnements/${id}` : 'http://localhost:8000/abonnements';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(abonnementData),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la création ou de la modification de l\'abonnement');
            }

            setSuccessMessage(isEditing ? 'L\'abonnement a été modifié avec succès.' : 'L\'abonnement a été créé avec succès.');

            // Délai avant redirection pour afficher le message de succès
            setTimeout(() => navigate('/abonnements'), 2000);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div><div><Button onClick={() => navigate(-1)} className='btn-secondary fs-5 text-center px-2 py-1 rounded-pill' style={{ margin: '3% 0% 3% 7%' }}>Retour</Button>
        </div>
        <div>
        <Container>
            <h1>{isEditing ? 'Modifier Abonnement' : 'Créer un Abonnement'}</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Titre</Form.Label>
                    <Form.Control
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Prix</Form.Label>
                    <Form.Control
                        type="text" // Utilisation de 'text' pour correspondre à la chaîne backend
                        value={prix}
                        onChange={(e) => setPrix(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label style={{ margin: '1% 0% 0% 0%' }}>Date de début</Form.Label>
                    <Form.Control
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label style={{ margin: '1% 0% 0% 0%' }}>Date de fin</Form.Label>
                    <Form.Control
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" style={{ margin: '3% 30% 3% 0%' }}> 
                    {isEditing ? 'Modifier' : 'Créer'}
                </Button>

                {error && <p className="text-danger">{error}</p>}
                {successMessage && <p className="text-success">{successMessage}</p>}
            </Form>
        </Container></div></div>
    );
};

export default AbonnementCreateOrEdit;







