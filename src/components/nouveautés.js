import React from "react";
import C from "../images/C.jpg";
import {Container} from "react-bootstrap"
const Nouv=()=>{
    return(
        <div className="C1 d-flex align-items-center justify-content-center">
  <Container>
    <div className="row d-flex align-items-center justify-content-around">
      <div className="nouv-titre col-lg-6 mb-4 mb-lg-0">
        <h1 className="Dec">Découvrez les nouveautés</h1>
        <p className="nouv-par text-start text-dark fs-5 lh-base my-2 py-3" style={{ fontFamily: 'Inter' }}>
          une application révolutionnaire pour piloter vos drones avec une interface intuitive, des contrôles gestuels et une collecte de données ultra-précise. Transformez vos vols avec des fonctionnalités de pointe.
        </p>
        <div className="d-flex justify-content-center">
        <button className="btn btn-secondary rounded-pill px-5 py-3 mx-auto my-5" style={{ fontSize: '20px', fontFamily: 'Inter' }}>
          En savoir plus
        </button>
        </div>
      </div>
      <div className="col-lg-6">
        <img src={C} className="nouv-img img-fluid" alt="Nouveautés" />
      </div>
    </div>
  </Container>
</div>

    )
}
export default Nouv;