import React, { useState } from "react";
import { useStarWars } from "../../Services/store/StarWarsListProvider";

const StarWarsList = () => {
    const { data } = useStarWars();
    console.log(data)
    type StarWars = {
        name: string;
        birthYear: string;
        eyeColor: string;
        gender: string;
        hairColor: string;
        height: number;
        mass: number;
        skinColor: string;
    };

    const [searchTerms, setSearchTerms] = useState({
        name: "",
        birthYear: "",
        eyeColor: "",
        gender:"",
        hairColor:"",
        height:"",
        mass:"",
        skinColor:"",
    });

    const filteredData = data
        ? data.filter((item:StarWars) => {
              return (
                  item.name.toLowerCase().includes(searchTerms.name.toLowerCase()) &&
                  item.birthYear.toLowerCase().includes(searchTerms.birthYear.toLowerCase()) &&
                  item.eyeColor.toLowerCase().includes(searchTerms.eyeColor.toLowerCase()) &&
                  item.gender.toLowerCase().includes(searchTerms.gender.toLowerCase()) &&
                  item.hairColor.toLowerCase().includes(searchTerms.hairColor.toLowerCase()) &&
                  String(item.height).toLowerCase().includes(searchTerms.height.toLowerCase()) &&
                  String(item.mass).toLowerCase().includes(searchTerms.mass.toLowerCase()) &&
                  item.hairColor.toLowerCase().includes(searchTerms.hairColor.toLowerCase())
              );
          })
        : [];

    const handleSearchChange = (column:string, value:string) => {
        setSearchTerms((prevSearchTerms) => ({
            ...prevSearchTerms,
            [column]: value,
        }));
    };

    return (
        <>
            <div className="d-flex justify-content-center">
                <div>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={searchTerms.name}
                                        onChange={(e) => handleSearchChange("name", e.target.value)}
                                    />
                                </th>
                                <th scope="col">
                                    <input
                                        type="text"
                                        placeholder="Birth Year"
                                        value={searchTerms.birthYear}
                                        onChange={(e) => handleSearchChange("birthYear", e.target.value)}
                                    />
                                </th>
                                <th scope="col">
                                    <input
                                        type="text"
                                        placeholder="Eye Color"
                                        value={searchTerms.eyeColor}
                                        onChange={(e) => handleSearchChange("eyeColor", e.target.value)}
                                    />
                                </th>
                                <th scope="col">
                                    <input
                                        type="text"
                                        placeholder="Gender"
                                        value={searchTerms.gender}
                                        onChange={(e) => handleSearchChange("gender", e.target.value)}
                                    />
                                </th>
                                <th scope="col">
                                    <input
                                        type="text"
                                        placeholder="Hair Color"
                                        value={searchTerms.hairColor}
                                        onChange={(e) => handleSearchChange("hairColor", e.target.value)}
                                    />
                                </th>
                                <th scope="col">
                                    <input
                                        type="text"
                                        placeholder="Height"
                                        value={searchTerms.height}
                                        onChange={(e) => handleSearchChange("height", e.target.value)}
                                    />
                                </th>
                                <th scope="col">
                                    <input
                                        type="text"
                                        placeholder="Mass"
                                        value={searchTerms.mass}
                                        onChange={(e) => handleSearchChange("mass", e.target.value)}
                                    />
                                </th>
                                <th scope="col">
                                    <input
                                        type="text"
                                        placeholder="Mass"
                                        value={searchTerms.mass}
                                        onChange={(e) => handleSearchChange("mass", e.target.value)}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item:StarWars, index:number) => (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{item.name}</td>
                                    <td>{item.birthYear}</td>
                                    <td>{item.eyeColor}</td>
                                    <td>{item.gender}</td>
                                    <td>{item.hairColor}</td>
                                    <td>{item.height}</td>
                                    <td>{item.mass}</td>
                                    <td>{item.skinColor}</td>
                                    {/* Render other columns */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default StarWarsList;
