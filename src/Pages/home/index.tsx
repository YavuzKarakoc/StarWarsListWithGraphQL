import React from "react";
import { useStarWars } from "../../Services/store/StarWarsListProvider";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const {} = useStarWars();

    const navigate = useNavigate();
    const goToStarWarsList = () => {
        navigate("/starwarslist");
    };
    return (
        <div>
            <h1>Home Page</h1>
            <button
                onClick={goToStarWarsList}
                type="button"
                className="btn btn-success"
            >
                Go to StarWars List
            </button>
        </div>
    );
};

export default Home;
