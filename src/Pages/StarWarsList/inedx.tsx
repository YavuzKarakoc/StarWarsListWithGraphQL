import React, { useEffect, useMemo, useState } from "react";
import { useStarWars } from "../../Services/store/StarWarsListProvider";
import "../StarWarsList/style.css";
import * as XLSX from "xlsx";
import { StarWars } from "./models";

const StarWarsList = () => {
    const { data, totalCount, setTotalCount, pageSize, setPageSize } =
        useStarWars();

    // filtreleme yapmak için kullandığımız state
    const [searchTerms, setSearchTerms] = useState({
        name: "",
        birthYear: "",
        eyeColor: "",
        gender: "",
        hairColor: "",
        height: "",
        mass: "",
        skinColor: "",
    });

    // input seçenekleriyle datanmızı filtrelediğimiz kısım. useMemo ile hesapladığımız için data veserachTerms değişmeden tekrar hesaplama yapmaz
    const filteredData = useMemo(() => {
        return data
            ? data.filter((item: StarWars) => {
                  return (
                      item.name
                          .toLowerCase()
                          .includes(searchTerms.name.toLowerCase()) &&
                      item.birthYear
                          .toLowerCase()
                          .includes(searchTerms.birthYear.toLowerCase()) &&
                      item.eyeColor
                          .toLowerCase()
                          .includes(searchTerms.eyeColor.toLowerCase()) &&
                      item.gender
                          .toLowerCase()
                          .includes(searchTerms.gender.toLowerCase()) &&
                      item.hairColor
                          .toLowerCase()
                          .includes(searchTerms.hairColor.toLowerCase()) &&
                      String(item.height)
                          .toLowerCase()
                          .includes(searchTerms.height.toLowerCase()) &&
                      String(item.mass)
                          .toLowerCase()
                          .includes(searchTerms.mass.toLowerCase()) &&
                      item.hairColor
                          .toLowerCase()
                          .includes(searchTerms.hairColor.toLowerCase())
                  );
              })
            : [];
    }, [data, searchTerms]);

    //filtreleme yaptığımızda paginationun doğru çalışması için totalCountu güncelliyoruz
    useEffect(() => {
        setTotalCount(filteredData.length);
    }, [filteredData, setTotalCount]);

    // filtreleme yaparken hangi kolonda yaptığımız ve hangi içeriğe göre yaptığımız, searchTerms i değiştirdiğimiz metot
    const handleSearchChange = (column: string, value: string) => {
        setSearchTerms((prevSearchTerms) => ({
            ...prevSearchTerms,
            [column]: value,
        }));
        setCurrentPage(1);
    };

    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<
        "asc" | "desc" | "default"
    >("default");

    // her tıklandığında sıralamanın yönünü belirler  asc => desc =>  default
    const handleSort = (column: string) => {
        if (sortColumn === column) {
            switch (sortDirection) {
                case "default":
                    setSortDirection("asc");
                    break;
                case "asc":
                    setSortDirection("desc");
                    break;
                case "desc":
                    setSortColumn(null);
                    setSortDirection("default");
                    break;
            }
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // burada tıkladığımız kolon adına göre sıralama yapar
    const sortedData = [...filteredData].sort((a: any, b: any) => {
        if (sortColumn) {
            const aValue = a[sortColumn];
            const bValue = b[sortColumn];

            if (aValue === null && bValue === null) {
                return 0;
            } else if (aValue === null) {
                return 1; // aValue null, bValue null değilse, bValue en önce gelmeli
            } else if (bValue === null) {
                return -1; // bValue null, aValue null değilse, aValue en önce gelmeli
            }

            if (typeof aValue === "string" && typeof bValue === "string") {
                return sortDirection === "asc"
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            } else if (
                typeof aValue === "number" &&
                typeof bValue === "number"
            ) {
                return sortDirection === "asc"
                    ? aValue - bValue
                    : bValue - aValue;
            }
        }

        return 0;
    });
    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    const currentItems = sortedData
        ? sortedData.slice(indexOfFirstItem, indexOfLastItem)
        : [];

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // sayfada kaç adet eleman gözükeceğine karar vermek için
    const handleChangePageSize = (newPageSize: number) => {
        setPageSize(newPageSize);
        setCurrentPage(1);
    };

    // filtrelemek için kullanılan değerleri siler ve 1. sayfaya defaulta döner
    const handleClearFilters = () => {
        setSearchTerms({
            name: "",
            birthYear: "",
            eyeColor: "",
            gender: "",
            hairColor: "",
            height: "",
            mass: "",
            skinColor: "",
        });
        setCurrentPage(1);
        setSortColumn(null);
        setSortDirection("default");
    };

    const exportToExcel = () => {
        // Excele göndereceğimiz veriyi ayarlıyoruz. Burada currentItems i kullanarak bulunduğumuz sayfadaki filtrelenmiş ve sıralanmış tabloyu excele aktarıyoruz.
        const data = currentItems.map((item: StarWars) => [
            item.name,
            item.birthYear,
            item.eyeColor,
            item.gender,
            item.hairColor,
            item.height,
            item.mass,
            item.skinColor,
        ]);

        // Excell de kolon başlık isimleri
        const sheetData = [
            [
                "Name",
                "Birth Year",
                "Eye Color",
                "Gender",
                "Hair Color",
                "Height",
                "Mass",
                "Skin Color",
            ],
            ...data,
        ];

        const ws = XLSX.utils.aoa_to_sheet(sheetData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "StarWarsData");
        XLSX.writeFile(wb, "StarWarsData.xlsx");
    };

    return (
        <div className="">
            <div className="d-flex justify-content-center logodiv">
                <img
                    className="logo"
                    src={require("../../assets/images/starwarslogo.png")}
                    alt=""
                />
            </div>
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">
                                <button onClick={handleClearFilters}>X</button>
                                <div className="border mt-1 bg-light">#</div>
                            </th>
                            <th scope="col">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={searchTerms.name}
                                    onChange={(e) =>
                                        handleSearchChange(
                                            "name",
                                            e.target.value
                                        )
                                    }
                                />
                                <div
                                    className="border mt-1 bg-light csp"
                                    onClick={() => handleSort("name")}
                                >
                                    {" "}
                                    Name
                                </div>
                            </th>
                            <th scope="col">
                                <input
                                    type="text"
                                    placeholder="Birth Year"
                                    value={searchTerms.birthYear}
                                    onChange={(e) =>
                                        handleSearchChange(
                                            "birthYear",
                                            e.target.value
                                        )
                                    }
                                />
                                <div
                                    className="border mt-1 bg-light csp"
                                    onClick={() => handleSort("birthYear")}
                                >
                                    {" "}
                                    Birth Year
                                </div>
                            </th>
                            <th scope="col">
                                <input
                                    type="text"
                                    placeholder="Eye Color"
                                    value={searchTerms.eyeColor}
                                    onChange={(e) =>
                                        handleSearchChange(
                                            "eyeColor",
                                            e.target.value
                                        )
                                    }
                                />
                                <div
                                    className="border mt-1 bg-light csp"
                                    onClick={() => handleSort("eyeColor")}
                                >
                                    {" "}
                                    Eye Color
                                </div>
                            </th>
                            <th scope="col">
                                <input
                                    type="text"
                                    placeholder="Gender"
                                    value={searchTerms.gender}
                                    onChange={(e) =>
                                        handleSearchChange(
                                            "gender",
                                            e.target.value
                                        )
                                    }
                                />
                                <div
                                    className="border mt-1 bg-light csp"
                                    onClick={() => handleSort("gender")}
                                >
                                    {" "}
                                    Gender
                                </div>
                            </th>
                            <th scope="col">
                                <input
                                    type="text"
                                    placeholder="Hair Color"
                                    value={searchTerms.hairColor}
                                    onChange={(e) =>
                                        handleSearchChange(
                                            "hairColor",
                                            e.target.value
                                        )
                                    }
                                />
                                <div
                                    className="border mt-1 bg-light csp"
                                    onClick={() => handleSort("hairColor")}
                                >
                                    {" "}
                                    Hair Color
                                </div>
                            </th>
                            <th scope="col">
                                <input
                                    type="text"
                                    placeholder="Height"
                                    value={searchTerms.height}
                                    onChange={(e) =>
                                        handleSearchChange(
                                            "height",
                                            e.target.value
                                        )
                                    }
                                />
                                <div
                                    className="border mt-1 bg-light csp"
                                    onClick={() => handleSort("height")}
                                >
                                    {" "}
                                    Height
                                </div>
                            </th>
                            <th scope="col">
                                <input
                                    type="text"
                                    placeholder="Mass"
                                    value={searchTerms.mass}
                                    onChange={(e) =>
                                        handleSearchChange(
                                            "mass",
                                            e.target.value
                                        )
                                    }
                                />
                                <div
                                    className="border mt-1 bg-light csp"
                                    onClick={() => handleSort("mass")}
                                >
                                    {" "}
                                    Mass
                                </div>
                            </th>
                            <th scope="col">
                                <input
                                    type="text"
                                    placeholder="Skin Color"
                                    value={searchTerms.skinColor}
                                    onChange={(e) =>
                                        handleSearchChange(
                                            "skinColor",
                                            e.target.value
                                        )
                                    }
                                />
                                <div
                                    className="border mt-1 bg-light csp"
                                    onClick={() => handleSort("skinColor")}
                                >
                                    {" "}
                                    Skin Color
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item: StarWars, index: number) => (
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
                            </tr>
                        ))}
                    </tbody>
                </table>
                
            </div>
            <div>
                <div className="d-flex justify-content-center ddd">
                    <nav aria-label="Page navigation example">
                        <ul className="pagination">
                            <li
                                className={`page-item ${
                                    currentPage === 1 ? "disabled" : ""
                                }`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() =>
                                        handlePageChange(currentPage - 1)
                                    }
                                >
                                    Previous
                                </button>
                            </li>
                            {Array.from({
                                length: Math.ceil(totalCount / pageSize),
                            }).map((_, index) => (
                                <li
                                    key={index}
                                    className={`page-item ${
                                        currentPage === index + 1
                                            ? "active"
                                            : ""
                                    }`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() => paginate(index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                            <li
                                className={`page-item ${
                                    currentPage ===
                                    Math.ceil(totalCount / pageSize)
                                        ? "disabled"
                                        : ""
                                }`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() =>
                                        handlePageChange(currentPage + 1)
                                    }
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                    <select
                        id="pageSizeSelect"
                        onChange={(e) =>
                            handleChangePageSize(parseInt(e.target.value))
                        }
                        value={pageSize}
                        className="border border-primary ms-2"
                        style={{ maxHeight: "38px", color: "blue" }}
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
                <div>
                    <button className="btn btn-success" onClick={exportToExcel}>
                        Export to Excel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StarWarsList;
