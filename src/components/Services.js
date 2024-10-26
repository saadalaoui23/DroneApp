import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from 'react-responsive-carousel';
import CARTE from "../images/CARTE.jpg";
import MOD from "../images/MOD.jpg";
import PLAN from "../images/PLAN.jpg";
import ANALY from "../images/ANALY.jpg";
import VOL from "../images/VOL.jpg";
import CO from "../images/CO.jpg";
import { useNavigate } from 'react-router-dom';

const Service = () => {
  
  const services = [
    {id: 1,
            title: "Cartographie Topographique",
      text: "Cartographie 2D et 3D : Création de cartes détaillées en deux et trois dimensions pour une variété d'applications, notamment l'urbanisme, l'agriculture, et la gestion des ressources naturelles. Orthophotos : Génération d'images aériennes corrigées géométriquement qui peuvent être utilisées comme cartes précises.",
      img: CARTE,
    },
    {id: 2,
      title: "Modélisation du Terrain",
      text: "Modèles Numériques de Terrain (MNT) : Création de modèles numériques représentant la surface terrestre sans les objets au-dessus (bâtiments, arbres). Modèles Numériques de Surface (MNS) : Création de modèles numériques incluant tous les objets présents sur la surface terrestre.",
      img: MOD,

    },
    {id: 3,
      title: "Planification et Gestion des Ressources Naturelles",
      text: "Analyse de l'utilisation des terres : Étude de l'utilisation actuelle des terres et planification de l'utilisation future basée sur la topographie. Gestion des bassins versants : Modélisation et gestion des bassins versants pour optimiser l'utilisation des ressources en eau.",
      img: PLAN,

    },
    {id: 4,
      title: "Analyse et Surveillance Topographique",
      text: "Analyse des pentes et des courbes de niveau : Identification des variations de la topographie et création de courbes de niveau pour l'étude du terrain. Surveillance des érosions et des glissements de terrain : Suivi des changements dans la topographie pour détecter et analyser les phénomènes d'érosion et de glissements de terrain.",
      img: ANALY,
    },
    {id: 5,
      title: "Géoréférencement Précis",
      text: "Intégration des données GPS/RTK : Utilisation de systèmes GPS/RTK pour obtenir des mesures topographiques très précises et géoréférencées. Points de contrôle au sol (GCP) : Utilisation de points de contrôle au sol pour améliorer la précision des cartes et des modèles topographiques.",
      img: CARTE,

    },
    {id: 6,
      title: "Suivi des Projets de Construction",
      text: "Surveillance de l'avancement des travaux : Suivi de l'évolution de la topographie d'un site de construction pour vérifier l'avancement des travaux et la conformité aux plans. Comparaison des relevés topographiques : Comparaison des relevés topographiques à différentes étapes d'un projet pour identifier les changements et ajuster les plans si nécessaire.",
      img: CO,

    },
    {id: 7,
      title: "Détection et Mesure des Volumes",
      text: "Calcul des volumes de terrassement : Estimation précise des volumes de terre à déplacer pour les projets de construction et de génie civil. Suivi des stocks : Mesure des volumes de matériaux stockés sur les sites de construction, les carrières et les mines.",
      img: VOL,
    },
  ];
  const navigate=useNavigate();
  const repeatedServices = [...services, ...services.slice(0, 2)];
  const groupedServices = [];
  for (let i = 0; i < repeatedServices.length; i += 3) {
    groupedServices.push(repeatedServices.slice(i, i + 3));
  }
  const handleCardClick = (serviceId) => {
    navigate(`/solutions/${serviceId}`);
  };
  return (
    <div className="service-bg">
      <Carousel 
      showThumbs={false}
      autoPlay={true}
      interval={2500}
      infiniteLoop={true}
      showArrows={true}
      showStatus={false}
      swipeable={true}
      dynamicHeight={false}
      >
        {groupedServices.map((group, idx) => (
          <div key={idx} className="group-slide">
            <Row className='d-flex flex-column align-items-center align-items-lg-stretch justify-content-center flex-lg-row w-100' > 
              {group.map((service, idx) => (
                <Col key={idx} className='col-card'>
          <Card className='card' onClick={() => handleCardClick(service.id)}>
            <Card.Img className='img-card' variant="top" src={service.img} alt={service.title} />
            <Card.Body>
              <Card.Title className="card-title">{service.title}</Card.Title>
              <Card.Text className="card-text">
                {service.text}
              </Card.Text>
            </Card.Body>
          </Card>
          </Col>
            ))}
          </Row>
        </div>
      ))}
    </Carousel>
    </div>
  );
};

export default Service;
