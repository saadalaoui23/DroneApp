import React from 'react'
import {Navbar, Nav, NavDropdown, Container} from 'react-bootstrap';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
const NavComp_client = () => {
  const navigate= useNavigate()
  const { isAuthenticated, logout } = useAuth(); // Utilisez isAuthenticated ici

  const handleLogout = () => {
    logout(); // Appelle la fonction de déconnexion
    navigate('/home_guest'); // Redirige vers la page de connexion après la déconnexion
  };

  return (<>
      <Navbar  expand="lg" className="navbar sticky-top bg-body-tertiary ">
    <Container >
      <Navbar.Brand className="fs-3 bold" href="#home" style={{color: 'rgb(44, 128, 47)', fontWeight:700}}>DRONE 4.0</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="#nouveautés">Nouveautés Drone 4.0</Nav.Link>
          <Nav.Link href="#Entreprise">Entreprise</Nav.Link>
          <NavDropdown title="Services" id="basic-nav-dropdown">
          <NavDropdown.Item onClick={()=>{navigate('/solutions/1')}}>Cartographie Topographique</NavDropdown.Item>
            <NavDropdown.Item href="/solutions/2">
            Modélisation du Terrain
            </NavDropdown.Item>
            <NavDropdown.Item href="/solutions/3">Planification et Gestion des Ressources Naturelles</NavDropdown.Item>
            <NavDropdown.Item onClick={()=>{navigate('/solutions/4')}}>Analyse et Surveillance Topographique</NavDropdown.Item>
            <NavDropdown.Item href="/solutions/5">Géoréférencement Précis</NavDropdown.Item>
            <NavDropdown.Item href="/solutions/6">Suivi des Projets de Construction</NavDropdown.Item>
            <NavDropdown.Item href="/solutions/7">Détection et Mesure des Volumes</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/checkout">Achetez Maintenant</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link onClick={()=>{navigate('/solutions')}}>Solutions</Nav.Link>
        </Nav>
      </Navbar.Collapse>
      <svg xmlns="http://www.w3.org/2000/svg" className='svg1' onClick={()=>navigate('/dashboard')} width={48} height={48} viewBox="0 0 24 24"><g fill="none" fillRule="evenodd"><path d="M24 0v24H0V0zM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path><path fill="#178245" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2M8.5 9.5a3.5 3.5 0 1 1 7 0a3.5 3.5 0 0 1-7 0m9.758 7.484A7.99 7.99 0 0 1 12 20a7.99 7.99 0 0 1-6.258-3.016C7.363 15.821 9.575 15 12 15s4.637.821 6.258 1.984"></path></g></svg>
      <button class='support' className="btn-c btn btn-outline-success m-2 px-2" type="submit" onClick={()=>navigate('support')}>Support</button>
      {isAuthenticated ? (
            <button className="btn-c btn btn-outline-success m-2 px-2" onClick={handleLogout}>Déconnexion</button>
          ) : (
            <button className="btn-c btn btn-outline-success m-2 px-2" onClick={() => navigate('/login_page')}>Connexion</button>
          )}
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

export default NavComp_client;