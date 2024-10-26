import React,{FC} from "react";
import {ReactNode} from "react";
interface Props{
    children:ReactNode;
    tooltip?:String;
}
const Tooltip: FC<Props> =({children,tooltip}): JSX.Element =>{
    return (<div className="group relative inline-block">
        {children}
        <span className="invisible group-hover:visible opacity-0 group-hover:opacity-100
         transition bg-blue-500 text-white p-1 absolute top-full mt-2"></span>
    </div>)
};
export default Tooltip; 