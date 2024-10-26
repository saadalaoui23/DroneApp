import {Navbar, Nav, NavDropdown, Container} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
const NavComp_visitor = () => {
  const navigate= useNavigate()
  
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
