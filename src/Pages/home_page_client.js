import NavComp_client from "../components/navbar_client";
import Nouv from "../components/nouveautés";
import Client from "../components/clients";
import Socio from "../components/réseaux";
import Service from "../components/Services";
import Bas from "../components/footer";
const  Home_Client= ()=>{
return(
    <>
    <div className="app-container">
        <NavComp_client/>
        </div>
        <div>
        <Nouv/>
        </div>
        <div>
        <Client/>
        </div>
        <div>
        <Service/>
        </div>
        <div>
        <Socio/>
        </div>
        <div>
        <Bas/>
        </div>
        </>
)
};
export default Home_Client;