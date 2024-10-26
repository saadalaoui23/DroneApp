import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import SUP from '../images/SUP.png';
import { Padding } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function Support() {
  const [message, setMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const navigate=useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulation d'envoi du message au support (à remplacer par une requête API réelle)
    console.log("Message envoyé au support : ", message);

    // Afficher la notification de succès
    setShowNotification(true);

    // Réinitialiser le formulaire après envoi
    setMessage('');
  };

  return (<div>
    <Button onClick={() => navigate(-1)} className='btn-secondary fs-5 text-center px-2 py-1 rounded-pill' style={{ margin: '3% 0% 0% 7%' }}>Retour</Button>
    <div className="support-page container-fluid d-flex flex-row justify-content-center align-items-center">
      
      <div className='col-md-9 d-flex flex-column justify-content-center align-items-center'>
        <h2 className="text-center mt-4 mb-4">Comment puis-je vous aider ?</h2>
        
        <Form onSubmit={handleSubmit} className="mx-auto col-md-8">
          <Form.Group controlId="supportMessage" className="mb-2">
            <Form.Control 
              as="textarea" 
              rows={8} 
              placeholder="Entrez votre message ici..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mb-4">
            Envoyer
          </Button>
        </Form>

        {showNotification && (
          <Alert className="col-md-10 mx-auto mt-4" variant="success" onClose={() => setShowNotification(false)} dismissible>
            Votre message a bien été envoyé au support.
          </Alert>
        )}
      </div>

      {/* Colonne 2 : Image avec une largeur de 3 colonnes (25% environ) */}
      <div className='col-md-5'>
        <img src={SUP} className="img-fluid" alt="Support" style={{ maxWidth: '70%', height: 'auto', Padding: '0% 0% 15% 0%' }} />
      </div>
    </div></div>
  );
}

export default Support;


