import { Navigate, Outlet } from "react-router-dom";
import { Header } from "../../components/Header/Header";

export function Root(){

    if (localStorage.getItem('token') === null) {
        return <Navigate to={"/"}/>
    }
    
    return (
        <>
        <header>
            <Header/>
        </header>
        <main>
            <Outlet />
        </main>
        <footer></footer>
        </>
    )
}