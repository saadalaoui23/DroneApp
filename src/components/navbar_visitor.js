import React, { useEffect, useState } from 'react';
import {Navbar, Nav, NavDropdown, Container} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
const NavComp_visitor = () => {
  const navigate= useNavigate()
  const [solutions, setSolutions] = useState([]);
  const fetchSolutions = async () => {
    try {
      const response = await fetch('http://localhost:8000/solutions'); // Remplacez l'URL par celle de votre API
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des solutions');
      }
      const data = await response.json();
      setSolutions(data); // Mettez à jour l'état avec les solutions récupérées
    } catch (error) {
      console.error('Error fetching solutions:', error);
    }
  };

  useEffect(() => {
    fetchSolutions(); // Appeler la fonction pour récupérer les solutions lors du montage du composant
  }, []);
  
  return (<>
      <Navbar  expand="lg" className="navbar sticky-top bg-body-tertiary ">
    <Container >
      <Navbar.Brand className="fs-3 bold" href="#home" style={{color: 'rgb(30, 85, 32)', fontWeight:700}}>DRONE 4.0</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="#nouveautés">Nouveautés Drone 4.0</Nav.Link>
          <Nav.Link href="#Entreprise">Entreprise</Nav.Link>
          <NavDropdown title="Services" id="basic-nav-dropdown">
                {solutions.map((solution) => (
                  <NavDropdown.Item key={solution.id} onClick={() => { navigate(`/solutions/${solution.id}`);setTimeout(() => {
                    const element = document.getElementById(`service-${solution.id}`); // Assurez-vous que l'ID est correct
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' }); // Défilement vers l'élément
                    }
                  }, 0); }}>
                    {solution.title}
                  </NavDropdown.Item>
                ))}
            <NavDropdown.Divider />
            <NavDropdown.Item href="/checkout">Achetez Maintenant</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link onClick={()=>{navigate('/solutions')}}>Solutions</Nav.Link>
          <Nav.Link onClick={()=>navigate('/abonnements')} >Abonnements</Nav.Link>
          <nav class='Login'>
          <Nav.Link onClick={()=>navigate('login_page')} style={{color: 'rgb(30, 85, 32)', fontWeight:700}} >Se connecter</Nav.Link>
          <Nav.Link href="#Support">Support</Nav.Link>
          </nav>
        </Nav>
      </Navbar.Collapse>
      <button onClick={()=>navigate('login_page')} className="btn-c btn btn-outline-success mx-3 px-2" type="submit">Connexion</button>
      <button class='support' className="btn-c btn btn-outline-success m-2 px-2" type="submit" onClick={()=>navigate('support')}>Support</button>
    </Container>
  </Navbar>
  <div className="bg color-overlay d-flex justify-content-center align-items-center">
  <div className="Petit-titre d-flex flex-column align-items-start">
    <h1 className='T1 text-start'>Volez vers de Nouvelles Opportunités<br/></h1>
    <h2 className="T2 text-start">Les Drones au Service de Votre Succès</h2>
  </div>
</div>

      </>
  );
};

export default NavComp_visitor;
