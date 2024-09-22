"use client";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import Image from "next/image";
import Navbar from "../common/Navbar";
import Elipse from "../../public/elipse.png";
import { Modal, TextField, Button, Select, MenuItem } from "@mui/material";
import { RxCrossCircled } from "react-icons/rx";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useRouter } from "next/navigation";

const FirmsTable: React.FC = () => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [toggle, setToggle] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift() || null;
    }
    return null;
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get("/api/auth/validate", {
          withCredentials: true,
        });

        const accessToken = getCookie("accessToken");
        if (!response.data.isLoggedIn || !accessToken) {
          router.push("/");
        }
      } catch (error) {}
    };

    checkLoginStatus();
  }, [router]);
  useEffect(() => {
    const timer: NodeJS.Timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const [formData, setFormData] = useState({
    firmName: "",
    firmType: "",
    gstNumber: "",
    gstAddress: "",
    panTanNumber: "",
    propertiorName: "",
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setToggle(false);
    setOpen(false);
    setFormData({
      firmName: "",
      firmType: "",
      gstNumber: "",
      gstAddress: "",
      panTanNumber: "",
      propertiorName: "",
    });
  };

  const [firmType] = useState([
    { label: "Proprietorship", value: "proprietorship" },
    { label: "Parntership", value: "partnerShip" },
    { label: "Private Limited", value: "pvtLimited" },
  ]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    setIsLoading(true);
    e.preventDefault();
    await axios
      .post("/api/firm/create", formData)
      .then((res) => {
        if (res.data.message === "exists") {
          alert("Firm already exists");
        } else {
          fetchFirms();
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
    handleClose();
  };

  const updateClick = async (id: string) => {
    setIsLoading(true);
    await axios
      .get(`/api/firm/${id}`)
      .then((res) => {
        handleOpen();
        setFormData(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
    setUpdate(true);
  };

  const handleUpdate = async (e: any) => {
    setIsLoading(true);
    e.preventDefault();
    await axios
      .put(`/api/firm/update`, formData)
      .then(() => {
        handleClose();
        setUpdate(false);
        fetchFirms();
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  const [getFirm, setGetFirm] = useState<any[]>([]);

  const fetchFirms = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/firm/getall");
      setGetFirm(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchFirms();
  }, []);

  const deleteClick = async (id: string) => {
    await axios
      .delete(`/api/firm/delete`, { data: { id } })
      .then(() => {
        fetchFirms();
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      {isLoading ? (
        <div className="loader-container">
          <div className="loader-container">
            <i>GTT</i>
          </div>
        </div>
      ) : null}
      <section className="firm-main-container">
        <Navbar />
        <Image
          src={Elipse}
          alt="elipse_design"
          style={{ width: "100%" }}
          className="elipse-home-image"
        />
        <p className="text-p card-badge">
          Home / <span style={{ color: "white" }}>Firm</span>
        </p>

        <Modal
          className="bus-form-modal"
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div className="bus-form-container">
            <form onSubmit={update ? handleUpdate : handleSubmit}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <h3>{update ? "Update Firm" : "Add Firm"}</h3>
                <RxCrossCircled
                  className="bus-form-cross"
                  onClick={handleClose}
                />
              </div>

              <div className="data-input-fields">
                <div className="bus-input-label">
                  <label className="input-label">Firm Name</label>
                  <TextField
                    className="bus-input"
                    margin="dense"
                    type="text"
                    fullWidth
                    name="firmName"
                    id="firmName"
                    value={formData.firmName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="bus-input-label">
                  <label className="input-label">Firm Type</label>
                  <Select
                    fullWidth
                    name="firmType"
                    value={formData.firmType}
                    onChange={handleInputChange}
                    required
                  >
                    {firmType.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="data-input-fields">
                <div className="bus-input-label">
                  <label className="input-label">GST Number</label>
                  <TextField
                    className="bus-input"
                    margin="dense"
                    type="text"
                    fullWidth
                    name="gstNumber"
                    id="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="bus-input-label">
                  <label className="input-label">GST Address</label>
                  <TextField
                    className="bus-input"
                    margin="dense"
                    type="text"
                    fullWidth
                    name="gstAddress"
                    id="gstAddress"
                    value={formData.gstAddress}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="data-input-fields">
                <div className="bus-input-label">
                  <label className="input-label">PAN/TAN Number</label>
                  <TextField
                    className="bus-input"
                    margin="dense"
                    type="text"
                    fullWidth
                    name="panTanNumber"
                    id="panTanNumber"
                    value={formData.panTanNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="bus-input-label">
                  <label className="input-label">Propertior Name</label>
                  <TextField
                    className="bus-input"
                    margin="dense"
                    type="text"
                    fullWidth
                    name="propertiorName"
                    id="propertiorName"
                    value={formData.propertiorName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="data-buttons" style={{ marginTop: "20px" }}>
                <Button
                  id="input-btn-submit"
                  className="submit"
                  type="submit"
                  variant="outlined"
                >
                  {update ? "Update" : "Submit"}
                </Button>
                <Button
                  id="input-btn-cancel"
                  className="cancel"
                  onClick={handleClose}
                  variant="outlined"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </Modal>

        <div className="table-main-container">
          <div className="title-button-container">
            <h3 className="table-h3">Firms</h3>
            <Button
              variant="outlined"
              onClick={() => {
                setToggle(!toggle);
              }}
              id="add-btn"
              className="add-btn-table"
            >
              {toggle ? (
                <div className="hide" onClick={handleClose}>
                  HIDE
                </div>
              ) : (
                <div className="add" onClick={handleOpen}>
                  + ADD FIRM
                </div>
              )}
            </Button>
          </div>
          <TableContainer component={Paper} className="table-container">
            <Table sx={{ minWidth: 650 }} aria-label="caption table">
              {getFirm.length === 0 ? (
                ""
              ) : (
                <caption>
                  <TablePagination
                    rowsPerPageOptions={[5]}
                    component="div"
                    count={getFirm.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </caption>
              )}

              <TableHead style={{ background: "#ddff8f" }}>
                <TableRow>
                  <TableCell className="head-tablecell">SL</TableCell>
                  <TableCell className="head-tablecell">Firm Name</TableCell>
                  <TableCell className="head-tablecell">Firm Type</TableCell>
                  <TableCell className="head-tablecell">GST</TableCell>
                  <TableCell className="head-tablecell">Address</TableCell>
                  <TableCell className="head-tablecell">PAN/TAN</TableCell>
                  <TableCell className="head-tablecell">Propertior</TableCell>
                  <TableCell className="head-tablecell" colSpan={2}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getFirm
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                      <TableCell className="body-tablecell">
                        {index + 1}
                      </TableCell>
                      <TableCell className="body-tablecell">
                        {row.firmName}
                      </TableCell>
                      <TableCell className="body-tablecell">
                        {row.firmType}
                      </TableCell>
                      <TableCell className="body-tablecell">
                        {row.gstNumber}
                      </TableCell>
                      <TableCell className="body-tablecell">
                        {row.gstAddress}
                      </TableCell>
                      <TableCell className="body-tablecell">
                        {row.panTanNumber}
                      </TableCell>
                      <TableCell className="body-tablecell">
                        {row.propertiorName}
                      </TableCell>
                      <TableCell className="body-tablecell">
                        <FaEdit
                          className="table-action-icon"
                          style={{ color: "blue" }}
                          onClick={() => updateClick(row._id)}
                        />
                      </TableCell>
                      <TableCell className="body-tablecell">
                        <MdDelete
                          className="table-action-icon"
                          style={{ color: "red" }}
                          onClick={() => deleteClick(row._id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            {getFirm.length === 0 ? (
              <div className="table-nodata">
                <h2>NO DATA</h2>
              </div>
            ) : null}
          </TableContainer>
        </div>
      </section>
    </>
  );
};

export default FirmsTable;
