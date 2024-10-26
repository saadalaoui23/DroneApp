import React, {Fragment}from 'react';
import NavComp_visitor from "../components/navbar_visitor";
import Nouv from "../components/nouveautés";
import Client from "../components/clients";
import Socio from "../components/réseaux";
import Service from "../components/Services";
import Bas from "../components/footer";
const  Home_visitor= ()=>{
return(
    <Fragment>
    <div >
        <NavComp_visitor/>
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
        </Fragment>
)
};
export default Home_visitor;