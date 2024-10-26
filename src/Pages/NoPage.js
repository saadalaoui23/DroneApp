import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const NoPage=()=>{
    const navigate=useNavigate()
    return(<>
        <h1 className="text-center fs-1 my-5">Error 404: Pager not found</h1>
        <div className="achetez">
        <Button onClick={()=>navigate(-1)}>retour</Button>
        </div>
        </>
    )
};
export default NoPage;