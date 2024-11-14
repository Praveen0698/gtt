"use client";
import React, { useEffect, useState, Suspense } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { SelectChangeEvent } from "@mui/material/Select";
import Image from "next/image";
import Navbar from "../common/Navbar";
import Elipse from "../../public/elipse.png";
import { TextField, Button, Select, MenuItem } from "@mui/material";
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import jwt, { JwtPayload } from "jsonwebtoken";

interface Item {
  id: string;
  vehicle: string;
  source: string;
  destination: string;
  aincout: string;
  generalIn: string;
  binaout: string;
  generalOut: string;
  cincout: string;
  shuttle2: string;
  shuttle3: string;
}

interface DecodedToken extends JwtPayload {
  userId: string;
}

const ShiftTable: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const searchParams = useSearchParams();

  const projectId = searchParams.get("projectId");
  const projectName = searchParams.get("projectName");
  const empId = searchParams.get("empId");
  const source = searchParams.get("source");
  const destination = searchParams.get("destination");
  const vehicle = searchParams.get("vehicle");

  const [getSource, setGetSource] = useState<any[]>([]);
  const [getDestination, setGetDestination] = useState<any[]>([]);
  const [getVehicle, setGetVehicle] = useState<any[]>([]);
  useEffect(() => {
    if (source) {
      if (source.trim().endsWith(",")) {
        setGetSource(source.trim().slice(0, -1).split(","));
      } else {
        setGetSource(source.split(","));
      }
    }

    if (destination) {
      if (destination.trim().endsWith(",")) {
        setGetDestination(destination.trim().slice(0, -1).split(","));
      } else {
        setGetDestination(destination.split(","));
      }
    }

    if (vehicle) {
      setGetVehicle(vehicle.split(","));
    }
  }, [source, destination, vehicle]);

  const getFormattedDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [item, setItem] = useState([
    {
      id: new Date().getTime().toString(),
      vehicle: "",
      source: "",
      destination: "",
      aincout: "",
      generalIn: "",
      binaout: "",
      generalOut: "",
      cincout: "",
      shuttle2: "",
      shuttle3: "",
    },
  ]);

  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift() || null;
    }
    return null;
  };

  const decodeAccessToken = (token: string): DecodedToken | null => {
    try {
      const decoded = jwt.decode(token) as DecodedToken;
      return decoded;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get("/api/auth/validate/manager", {
          withCredentials: true,
        });
        const accessToken = getCookie("accessToken");
        const decodedToken = accessToken
          ? decodeAccessToken(accessToken)
          : null;
        if (
          !response.data.isLoggedIn ||
          !accessToken ||
          decodedToken?.role !== "manager"
        ) {
          router.push("/");
        }
      } catch (error) {
        console.error("Error in login validation:", error);
      }
    };

    checkLoginStatus();
  }, [router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const [formData, setFormData] = useState({
    projectId: projectId,
    projectName: projectName,
    employeeId: empId,
    date: "",
    items: [
      {
        id: "",
        vehicle: "",
        source: "",
        destination: "",
        aincout: "",
        generalIn: "",
        binaout: "",
        generalOut: "",
        cincout: "",
        shuttle2: "",
        shuttle3: "",
      },
    ],
  });

  const addItem = () => {
    const newItem: Item = {
      id: new Date().getTime().toString(),
      vehicle: "",
      source: "",
      destination: "",
      aincout: "",
      generalIn: "",
      binaout: "",
      generalOut: "",
      cincout: "",
      shuttle2: "",
      shuttle3: "",
    };
    setItem([...item, newItem]);
    setFormData({
      ...formData,
      items: item,
    });
  };

  useEffect(() => {
    setFormData({
      ...formData,
      items: item,
    });
  }, [item]);

  const handleItemChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>,
    id: string
  ) => {
    const updatedItems = item.map((elem) =>
      elem.id === id ? { ...elem, [e.target.name]: e.target.value } : elem
    );
    setItem(updatedItems);
    setFormData({
      ...formData,
      items: item,
    });
  };

  const deleteRow = (id: string) => {
    const updatedData = item.filter((elem) => elem.id !== id);
    setItem(updatedData);
  };

  const [getEmployee, setGetEmployee] = useState<any[]>([]);

  const fetchEmployee = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/employee/getall");
      setGetEmployee(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const [getShift, setGetShift] = useState<any[]>([]);

  const fetchShift = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`/api/shift/getall/${empId}/${projectId}`);
      setGetShift(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchShift();
    fetchEmployee();
  }, [empId, projectId]);

  const handleSave = async () => {
    setIsLoading(true);
    await axios
      .post("/api/shift/create", formData)
      .then(() => fetchShift())
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
    setFormData({
      projectId: projectId,
      projectName: projectName,
      employeeId: empId,
      date: "",
      items: [
        {
          id: "",
          vehicle: "",
          source: "",
          destination: "",
          aincout: "",
          generalIn: "",
          binaout: "",
          generalOut: "",
          cincout: "",
          shuttle2: "",
          shuttle3: "",
        },
      ],
    });
    setItem([
      {
        id: "",
        vehicle: "",
        source: "",
        destination: "",
        aincout: "",
        generalIn: "",
        shuttle2: "",
        binaout: "",
        shuttle3: "",
        generalOut: "",
        cincout: "",
      },
    ]);
  };

  const handleAutoFill = async () => {
    if (formData.date) {
      setIsLoading(true);
      await axios
        .get(`/api/shift/get/${empId}/${projectId}/${formData.date}`)
        .then((res) => {
          setItem(res.data.data);
          setFormData({ ...formData, date: res.data.date });
          console.log(res.data);
        })
        .catch(() => {
          setItem([
            {
              id: "",
              vehicle: "",
              source: "",
              destination: "",
              aincout: "",
              generalIn: "",
              shuttle2: "",
              binaout: "",
              shuttle3: "",
              generalOut: "",
              cincout: "",
            },
          ]);
          formData.date = "";
        })
        .finally(() => setIsLoading(false));
    } else {
      alert("Select date!!");
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="loader-container">
          <div className="loader-container">
            <i>GTT</i>
          </div>
        </div>
      ) : (
        <section className="firm-main-container">
          <Navbar />
          <Image
            src={Elipse}
            alt="elipse_design"
            style={{ width: "100%" }}
            className="elipse-home-image"
          />
          <p className="text-p card-badge">
            Home / <span style={{ color: "white" }}>Shifts</span>
          </p>

          <div className="table-main-container">
            <div
              className="title-button-container"
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <div className="flex justify-between items-centers gap-5">
                {getShift.length > 0 ? (
                  <Button
                    id="input-btn-cancel"
                    className="cancel"
                    style={{ background: "#ccc", color: "black" }}
                    onClick={handleAutoFill}
                    variant="outlined"
                  >
                    Auto
                  </Button>
                ) : null}
                <input
                  type="date"
                  style={{
                    width: "150px",
                    border: "1px solid black",
                    padding: "2px 10px",
                    borderRadius: "5px",
                  }}
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>
              <h3 className="table-h3">Project wise Shifts</h3>
            </div>
            <TableContainer component={Paper} className="table-container">
              <Table sx={{ minWidth: 650 }} aria-label="caption table">
                <TableHead style={{ background: "#ddff8f" }}>
                  <TableRow>
                    <TableCell
                      style={{ fontWeight: "bold", textAlign: "center" }}
                    >
                      SL
                    </TableCell>
                    <TableCell
                      style={{ fontWeight: "bold", textAlign: "center" }}
                    >
                      Vehicle
                    </TableCell>
                    <TableCell
                      style={{ fontWeight: "bold", textAlign: "center" }}
                    >
                      Source
                    </TableCell>
                    <TableCell
                      style={{ fontWeight: "bold", textAlign: "center" }}
                    >
                      Destination
                    </TableCell>
                    <TableCell
                      style={{ fontWeight: "bold", textAlign: "center" }}
                    >
                      A-shift 5am
                    </TableCell>
                    <TableCell
                      style={{ fontWeight: "bold", textAlign: "center" }}
                    >
                      General In 8am
                    </TableCell>
                    <TableCell
                      style={{ fontWeight: "bold", textAlign: "center" }}
                    >
                      Shuttle 1
                    </TableCell>
                    <TableCell
                      style={{ fontWeight: "bold", textAlign: "center" }}
                    >
                      B-shift 1pm
                    </TableCell>
                    <TableCell
                      style={{ fontWeight: "bold", textAlign: "center" }}
                    >
                      Shuttle 2
                    </TableCell>
                    <TableCell
                      style={{ fontWeight: "bold", textAlign: "center" }}
                    >
                      General Out 5pm
                    </TableCell>
                    <TableCell
                      style={{ fontWeight: "bold", textAlign: "center" }}
                    >
                      C-shift 9pm
                    </TableCell>

                    <TableCell
                      style={{ fontWeight: "bold", textAlign: "center" }}
                      colSpan={2}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {item.map((row, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      <TableCell style={{ textAlign: "center" }}>
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <Select
                          fullWidth
                          name="vehicle"
                          style={{ width: "200px" }}
                          value={row.vehicle}
                          onChange={(e) => handleItemChange(e, row.id)}
                        >
                          {Array.isArray(getSource) && getVehicle.length > 0 ? (
                            getVehicle.map((type) => (
                              <MenuItem key={type} value={type}>
                                {type}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>No data available</MenuItem>
                          )}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          fullWidth
                          name="source"
                          style={{ width: "200px" }}
                          value={row.source}
                          onChange={(e) => handleItemChange(e, row.id)}
                        >
                          {Array.isArray(getSource) && getSource.length > 0 ? (
                            getSource.map((type) => (
                              <MenuItem key={type} value={type}>
                                {type}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>No data available</MenuItem>
                          )}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          fullWidth
                          name="destination"
                          style={{ width: "200px" }}
                          value={row.destination}
                          onChange={(e) => handleItemChange(e, row.id)}
                        >
                          {Array.isArray(getDestination) &&
                          getDestination.length > 0 ? (
                            getDestination.map((type) => (
                              <MenuItem key={type} value={type}>
                                {type}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>No data available</MenuItem>
                          )}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          fullWidth
                          name="aincout"
                          style={{ width: "200px" }}
                          value={row.aincout}
                          onChange={(e) => handleItemChange(e, row.id)}
                        >
                          {getEmployee.length > 0 ? (
                            getEmployee
                              .filter((type) =>
                                ["Driver-1", "Driver-2", "Driver-3"].includes(
                                  type.designation
                                )
                              )
                              .map((type) => (
                                <MenuItem
                                  key={type._id}
                                  value={type.employeeName}
                                >
                                  {type.employeeName}
                                </MenuItem>
                              ))
                          ) : (
                            <MenuItem disabled>No data available</MenuItem>
                          )}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          fullWidth
                          name="generalIn"
                          style={{ width: "200px" }}
                          value={row.generalIn}
                          onChange={(e) => handleItemChange(e, row.id)}
                        >
                          {getEmployee.length > 0 ? (
                            getEmployee
                              .filter((type) =>
                                ["Driver-1", "Driver-2", "Driver-3"].includes(
                                  type.designation
                                )
                              )
                              .map((type) => (
                                <MenuItem
                                  key={type._id}
                                  value={type.employeeName}
                                >
                                  {type.employeeName}
                                </MenuItem>
                              ))
                          ) : (
                            <MenuItem disabled>No data available</MenuItem>
                          )}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          fullWidth
                          name="shuttle2"
                          style={{ width: "200px" }}
                          value={row.shuttle2}
                          onChange={(e) => handleItemChange(e, row.id)}
                        >
                          {getEmployee.length > 0 ? (
                            getEmployee
                              .filter((type) =>
                                ["Driver-1", "Driver-2", "Driver-3"].includes(
                                  type.designation
                                )
                              )
                              .map((type) => (
                                <MenuItem
                                  key={type._id}
                                  value={type.employeeName}
                                >
                                  {type.employeeName}
                                </MenuItem>
                              ))
                          ) : (
                            <MenuItem disabled>No data available</MenuItem>
                          )}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          fullWidth
                          name="binaout"
                          style={{ width: "200px" }}
                          value={row.binaout}
                          onChange={(e) => handleItemChange(e, row.id)}
                        >
                          {getEmployee.length > 0 ? (
                            getEmployee
                              .filter((type) =>
                                ["Driver-1", "Driver-2", "Driver-3"].includes(
                                  type.designation
                                )
                              )
                              .map((type) => (
                                <MenuItem
                                  key={type._id}
                                  value={type.employeeName}
                                >
                                  {type.employeeName}
                                </MenuItem>
                              ))
                          ) : (
                            <MenuItem disabled>No data available</MenuItem>
                          )}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          fullWidth
                          name="shuttle3"
                          style={{ width: "200px" }}
                          value={row.shuttle3}
                          onChange={(e) => handleItemChange(e, row.id)}
                        >
                          {getEmployee.length > 0 ? (
                            getEmployee
                              .filter((type) =>
                                ["Driver-1", "Driver-2", "Driver-3"].includes(
                                  type.designation
                                )
                              )
                              .map((type) => (
                                <MenuItem
                                  key={type._id}
                                  value={type.employeeName}
                                >
                                  {type.employeeName}
                                </MenuItem>
                              ))
                          ) : (
                            <MenuItem disabled>No data available</MenuItem>
                          )}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          fullWidth
                          name="generalOut"
                          style={{ width: "200px" }}
                          value={row.generalOut}
                          onChange={(e) => handleItemChange(e, row.id)}
                        >
                          {getEmployee.length > 0 ? (
                            getEmployee
                              .filter((type) =>
                                ["Driver-1", "Driver-2", "Driver-3"].includes(
                                  type.designation
                                )
                              )
                              .map((type) => (
                                <MenuItem
                                  key={type._id}
                                  value={type.employeeName}
                                >
                                  {type.employeeName}
                                </MenuItem>
                              ))
                          ) : (
                            <MenuItem disabled>No data available</MenuItem>
                          )}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          fullWidth
                          name="cincout"
                          style={{ width: "200px" }}
                          value={row.cincout}
                          onChange={(e) => handleItemChange(e, row.id)}
                        >
                          {getEmployee.length > 0 ? (
                            getEmployee
                              .filter((type) =>
                                ["Driver-1", "Driver-2", "Driver-3"].includes(
                                  type.designation
                                )
                              )
                              .map((type) => (
                                <MenuItem
                                  key={type._id}
                                  value={type.employeeName}
                                >
                                  {type.employeeName}
                                </MenuItem>
                              ))
                          ) : (
                            <MenuItem disabled>No data available</MenuItem>
                          )}
                        </Select>
                      </TableCell>
                      {formData.items.length !== 1 ? (
                        <TableCell
                          style={{
                            textAlign: "center",
                            cursor: "pointer",
                          }}
                          onClick={() => deleteRow(row.id)}
                        >
                          <MdDelete color="red" size={24} />
                        </TableCell>
                      ) : null}
                      {formData.items.length === index + 1 ? (
                        <TableCell
                          style={{ textAlign: "center", cursor: "pointer" }}
                          onClick={addItem}
                        >
                          <IoMdAdd color="green" size={24} />
                        </TableCell>
                      ) : null}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="m-2.5">
                <Button
                  id="input-btn-submit"
                  className="submit"
                  type="submit"
                  variant="outlined"
                  onClick={handleSave}
                >
                  Submit
                </Button>
              </div>
            </TableContainer>
          </div>
        </section>
      )}
    </>
  );
};

export default ShiftTable;
