import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Spinner, Button, Modal} from 'react-bootstrap'; // For loading spinner
import axios from 'axios'; // Importing Axios

const Dashboard = () => {
  const { isAuthenticated, loading } = useAuth(); // Get authentication and loading state
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [abonnements, setAbonnements] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // Admin status
  const [error, setError] = useState(null); // Error state
  const [filteredUsers, setFilteredUsers] = useState([]); // State for filtered users
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null); // ID of the item to delete
  const [deletingType, setDeletingType] = useState(null); 

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:8000/${deletingType}/${itemToDelete}`);
      if (response.status !== 200) {
        throw new Error('Erreur lors de la suppression');
      }

      // Mettre à jour l'état en fonction du type de suppression
      if (deletingType === 'solutions') {
        setSolutions(solutions.filter(solution => solution.id !== itemToDelete));
      } else if (deletingType === 'abonnements') {
        setAbonnements(abonnements.filter(abonnement => abonnement.id !== itemToDelete));
      }

      setShowDeleteModal(false); // Fermer la modale après la suppression
    } catch (error) {
      setError(error.message);
    }
  };
// Fonction pour gérer la suppression
const handleDelete = (id, type) => {
    setItemToDelete(id);
    setDeletingType(type);
    setShowDeleteModal(true); // Afficher la modale de confirmation
  };

  // Check admin status
  useEffect(() => {
    const checkAdminStatus = () => {
      const adminStatus = localStorage.getItem('is_admin');
      if (adminStatus === 'true') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        navigate('/home_page_client'); // Redirect non-admins
      }
    };

    if (isAuthenticated && !loading) {
      checkAdminStatus();
    } else if (!isAuthenticated && !loading) {
      navigate('/login'); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, loading, navigate]);

  // Fetch users with Axios
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/users/');
      setUsers(response.data);
      setFilteredUsers(response.data); // Initialize filtered users
    } catch (error) {
      setError('Erreur lors de la récupération des utilisateurs');
      console.error('Error fetching users:', error);
    }
  };

  // Fetch solutions with Axios
  const fetchSolutions = async () => {
    try {
      const response = await axios.get('http://localhost:8000/solutions');
      setSolutions(response.data);
    } catch (error) {
      setError('Erreur lors de la récupération des solutions');
      console.error('Error fetching solutions:', error);
    }
  };

  // Fetch abonnements with Axios
  const fetchAbonnements = async () => {
    try {
      const response = await axios.get('http://localhost:8000/abonnements');
      setAbonnements(response.data);
    } catch (error) {
      setError('Erreur lors de la récupération des abonnements');
      console.error('Error fetching abonnements:', error);
    }
  };

  // Fetch data when admin
  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchSolutions();
      fetchAbonnements();
    }
  }, [isAdmin]);

  // Show a loading spinner while checking auth status
  if (loading) {
    return <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>;
  }

  if (error) {
    return <div className="alert alert-danger">Erreur: {error}</div>;
  }

  // Filtered users based on selected filter values
  const handleFilter = (filterValues) => {
    const { prenom, nom, year, month, day, username, email,is_admin } = filterValues;

    const newFilteredUsers = users.filter(user => {
        const userBirthDate = new Date(user.age);
        const userYear = userBirthDate.getFullYear();
        const userMonth = userBirthDate.getMonth() + 1; // Months are zero-indexed
        const userDay = userBirthDate.getDate(); 

      return (
        user.prenom.toLowerCase().includes(prenom.toLowerCase()) &&
        user.nom.toLowerCase().includes(nom.toLowerCase()) &&
        (year ? userYear === parseInt(year) : true) &&
        (month ? userMonth === parseInt(month) : true) &&
        (day ? userDay === parseInt(day) : true) &&
        user.username.toLowerCase().includes(username.toLowerCase()) &&
        user.email.toLowerCase().includes(email.toLowerCase()) &&
        (is_admin ? user.is_admin === is_admin : true)
      );
    });

    setFilteredUsers(newFilteredUsers);
  };

  // Integrated Filter Component
  const FilterComponent = ({ onFilter }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filterValues, setFilterValues] = useState({
      prenom: '',
      nom: '',
      year: '',
      month: '',
      day: '',
      username: '',
      email: '',
      is_admin: false,
    });

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFilterValues({
        ...filterValues,
        [name]: type === 'checkbox' ? checked : value,
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onFilter(filterValues);
    };
     // Handle delete confirmation
  
    return (
      <div className="mb-3">
        <button className='btn btn-outline-success m-2 px-3 py-2 ' onClick={() => setIsOpen(!isOpen)} style={{fontFamily: 'Wittgenstein'  }}>
          Filtre
        </button>
        {isOpen && (
            <div className="border rounded p-3 mt-2">
          <form onSubmit={handleSubmit} className="mt-2">
            <div className="row mb-2">
            <div className="col">
            <input
              type="text"
              name="prenom"
              placeholder="Filter by First Name"
              value={filterValues.prenom}
              onChange={handleChange}
              className="form-control mb-2"
            />
            </div>
            <div className="col">
            <input
              type="text"
              name="nom"
              placeholder="Filter by Last Name"
              value={filterValues.nom}
              onChange={handleChange}
              className="form-control mb-2"
            />
            </div>
            </div>
            <div className="row mb-2">
              <div className="col">
            <input
              type="text"
              name="year"
              placeholder="Filter by Year (YYYY)"
              value={filterValues.year}
              onChange={handleChange}
              className="form-control mb-2"
            />
            </div>
            <div className="col">
            <select
              name="month"
              value={filterValues.month}
              onChange={handleChange}
              className="form-control mb-2"
            >
              <option value="">Any Month</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
            </div>
              <div className="col">
            <input
              type="text"
              name="day"
              placeholder="Filter by Day (1-31)"
              value={filterValues.day}
              onChange={handleChange}
              className="form-control mb-2"
            />
            </div>
            </div>
            <div className="row mb-2">
              <div className="col">
            <input
              type="text"
              name="username"
              placeholder="Filter by Username"
              value={filterValues.username}
              onChange={handleChange}
              className="form-control mb-2"
            />
            </div>
            <div className="col">
            <input
              type="email"
              name="email"
              placeholder="Filter by Email"
              value={filterValues.email}
              onChange={handleChange}
              className="form-control mb-2"
            />
            </div>
            </div>
            <label>
              <input
                type="checkbox"
                name="is_admin"
                checked={filterValues.is_admin}
                onChange={handleChange}
              />
              Is Admin
            </label>
            <button type="submit" className="btn btn-success mt-2" style={{fontFamily: 'Wittgenstein'  }}>Apply Filters</button>
          </form>
          </div>
        )}
      </div>
    );
  };

  return (
    isAdmin && (
      <div className="container">
        <Button onClick={() => navigate(-1)} className='btn-secondary fs-5 text-center px-2 py-1 rounded-pill' style={{fontFamily:'Wittgenstein', margin: '3% 0% 0% 7%' }}>Retour</Button>
        <h1 className='T6 text-center'>Admin Dashboard</h1>

        <h2 className='Fs-1 fw-bold text-center' style={{fontFamily:'Wittgenstein', margin:'3% 0% 3% 0% '}}>Utilisateurs</h2>
<div className="border p-3 mb-4 rounded">
    <FilterComponent onFilter={handleFilter} />
    {filteredUsers.length > 0 ? (  // Changer ici de users à filteredUsers
        <div className="row">
            {filteredUsers.length > 10 ? (
                filteredUsers.map((user, index) => (
                    <div className="col-md-6 mb-3" key={user.id}>
                        <div className="list-group-item mb-1 ">
                            {user.prenom} {user.nom} : @{user.username}: {user.email}
                        </div>
                    </div>
                ))
            ) : (
                filteredUsers.map(user => (  // Changer ici aussi
                    <div className="col-12 mb-3" key={user.id}>
                        <div className="list-group-item border mb-2">
                            {user.prenom} {user.nom} : @{user.username}: {user.email}
                        </div>
                    </div>
                ))
            )}
        </div>
    ) : (
        <p>No users found.</p>
    )}
</div>

        {/* Solutions Section */}
        <h2 className='Fs-1 fw-bold text-center' style={{fontFamily:'Wittgenstein', margin:'7% 0% 0% 0% '}} >Solutions</h2>
        <button className='btn btn-outline-success m-2 px-3 py-2 ' onClick={() => navigate(`/solutions/create`)} style={{fontFamily:'Wittgenstein', margin:'3% 0% 3% 0% '}}>
                    Ajouter
                </button>
                {solutions.length > 0 ? (
    <ul className="list-group">
        {solutions.map(solution => (
            <li className="list-group-item d-flex justify-content-between align-items-center" key={solution.id}>
                <span className="fw-bold">{solution.title}</span>
                <div className="d-flex">
                    <button className="btn btn-secondary btn-sm me-2" onClick={() => navigate(`/solution/edit/${solution.id}`)} style={{fontFamily: 'Wittgenstein'  }}>
                        Modifier
                    </button>
                    <Button variant="danger" onClick={() => handleDelete(solution.id, 'solutions')} style={{fontFamily: 'Wittgenstein'  }}>
                        Supprimer
                    </Button>
                </div>
            </li>
        ))}
    </ul>
) : (
    <p>No solutions found.</p>
)}


        {/* Abonnements Section */}
        <h2 className='Fs-1 fw-bold text-center' style={{fontFamily:'Wittgenstein', margin:'7% 0% 0% 0% '}}>Abonnements</h2>
        <button className='btn btn-outline-success m-2 px-3 py-2 ' onClick={() => navigate(`/Abonnements/create`)} style={{fontFamily:'Wittgenstein', margin:'3% 0% 3% 0% '}}>
                    Ajouter
                </button>
                {abonnements.length > 0 ? (
    <ul className="list-group">
        {abonnements.map(abonnement => (
            <li className="list-group-item d-flex justify-content-between align-items-center" key={abonnement.id}>
                <span className="fw-bold">{abonnement.title} : {abonnement.price}€</span>
                <div className="d-flex">
                    <button className="btn btn-secondary btn-sm me-2" onClick={() => navigate(`/abonnement/edit/${abonnement.id}`)} style={{fontFamily: 'Wittgenstein'  }}>
                        Modifier
                    </button>
                    <Button variant="danger" onClick={() => handleDelete(abonnement.id, 'abonnements')} style={{fontFamily: 'Wittgenstein'  }}>
                        Supprimer
                    </Button>
                </div>
            </li>
        ))}
    </ul>
) : (
    <p>No abonnements found.</p>
)}

<Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Êtes-vous sûr de vouloir supprimer cet élément ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Annuler</Button>
          <Button variant="danger" onClick={confirmDelete}>Confirmer la suppression</Button>
        </Modal.Footer>
      </Modal>
      </div>
    )
  );
};

export default Dashboard;


  





