
import { Outlet } from "react-router-dom"

import Intro from "./Intro";

const Protected = () => {

    const token = localStorage.getItem('token');

    return (

        token ? <Outlet /> : <Intro />

    )


}


export default Protected