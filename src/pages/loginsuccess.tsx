import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LoginSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);

        const steamid = params.get("steamid");
        const redirect = params.get("redirect") || "/";

        if (steamid) {
            sessionStorage.setItem("steamid", steamid.toString());

            navigate(redirect, { replace: true });
        } else {
            navigate("/", { replace: true })
        }

    }, [location, navigate]);

    return (
        <><h1>Redirecting</h1></>
    )
}

export default LoginSuccess;
