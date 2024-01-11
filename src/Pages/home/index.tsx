import React from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

const Home = () => {
    const navigate = useNavigate();
    const goToStarWarsList = () => {
        navigate("/starwarslist");
    };
    return (
        <div className="body">
            <div className="d-flex justify-content-center">
                <img className="logo" src={require("../../assets/images/3.png")} alt="" />
            </div>
            <div className="">
                <img className="starWarPoster" src={require("../../assets/images/StarWarsPoster.jpg")} alt="" />
            </div>
            <div >
                <h1 className="text">Welcome to bestERA Test Case</h1>
                <button
                    onClick={goToStarWarsList}
                    type="button"
                    className="btn btn-success  py-3 px-5"
                >
                    Go to StarWars List
                </button>
            </div>
        </div>
    );
};

export default Home;
