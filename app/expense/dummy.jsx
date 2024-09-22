// "use client";
// import React, { useEffect, useState } from "react";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";
// import TablePagination from "@mui/material/TablePagination";
// import Image from "next/image";
// import Navbar from "../common/Navbar";
// import Elipse from "../../public/elipse.png";
// import { Modal, TextField, Button, Select, MenuItem, CircularProgress } from "@mui/material";
// import { RxCrossCircled } from "react-icons/rx";
// import axios from "axios";
// import { FaEdit } from "react-icons/fa";
// import { MdDelete } from "react-icons/md";

// const FirmsTable: React.FC = () => {
//   const [page, setPage] = useState<number>(0);
//   const [rowsPerPage, setRowsPerPage] = useState<number>(5);
//   const [toggle, setToggle] = useState<boolean>(false);

//   const handleChangePage = (event: unknown, newPage: number) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   const [open, setOpen] = useState(false);
//   const [update, setUpdate] = useState(false);
//   const [formData, setFormData] = useState({
//     firmName: "",
//     firmType: "",
//     gstNumber: "",
//     gstAddress: "",
//     panTanNumber: "",
//     propertiorName: "",
//   });

//   // Loading states
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [isUpdating, setIsUpdating] = useState(false);

//   const handleOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setToggle(false);
//     setOpen(false);
//     setFormData({
//       firmName: "",
//       firmType: "",
//       gstNumber: "",
//       gstAddress: "",
//       panTanNumber: "",
//       propertiorName: "",
//     });
//   };

//   const [firmType] = useState([
//     { label: "Proprietorship", value: "proprietorship" },
//     { label: "Parntership", value: "partnerShip" },
//     { label: "Private Limited", value: "pvtLimited" },
//   ]);

//   const handleInputChange = (e: any) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     setIsSubmitting(true); // Start loading for create API
//     await axios
//       .post("/api/firm/create", formData)
//       .then((res) => {
//         if (res.data.message === "exists") {
//           alert("Firm already exists");
//         } else {
//           fetchFirms();
//         }
//       })
//       .catch((err) => console.error(err))
//       .finally(() => setIsSubmitting(false)); // Stop loading
//     handleClose();
//   };

//   const updateClick = async (id: string) => {
//     setIsUpdating(true); // Start loading for update API
//     await axios
//       .get(`/api/firm/${id}`)
//       .then((res) => {
//         handleOpen();
//         setFormData(res.data);
//       })
//       .catch((err) => console.error(err))
//       .finally(() => setIsUpdating(false)); // Stop loading
//     setUpdate(true);
//   };

//   const handleUpdate = async (e: any) => {
//     e.preventDefault();
//     setIsSubmitting(true); // Start loading for update API
//     await axios
//       .put(`/api/firm/update`, formData)
//       .then(() => {
//         handleClose();
//         setUpdate(false);
//         fetchFirms();
//       })
//       .catch((err) => console.error(err))
//       .finally(() => setIsSubmitting(false)); // Stop loading
//   };

//   const [getFirm, setGetFirm] = useState<any[]>([]);

//   const fetchFirms = async () => {
//     setIsLoading(true); // Start loading for getAll API
//     try {
//       const res = await axios.get("/api/firm/getall");
//       setGetFirm(res.data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setIsLoading(false); // Stop loading
//     }
//   };

//   useEffect(() => {
//     fetchFirms();
//   }, []);

//   const deleteClick = async (id: string) => {
//     setIsDeleting(true); // Start loading for delete API
//     await axios
//       .delete(`/api/firm/delete`, { data: { id } })
//       .then(() => {
//         fetchFirms();
//       })
//       .catch((err) => console.error(err))
//       .finally(() => setIsDeleting(false)); // Stop loading
//   };

//   return (
//     <section className="firm-main-container">
//       <Navbar />
//       <Image
//         src={Elipse}
//         alt="elipse_design"
//         style={{ width: "100%" }}
//         className="elipse-home-image"
//       />
//       <p className="text-p card-badge">
//         Home / <span style={{ color: "white" }}>Firm</span>
//       </p>

//       {/* Show loader when fetching firms */}
//   {isLoading ? (
//     <div className="loader-container">
//       <CircularProgress />
//     </div>
//   ) : (
//         <>
//           <Modal
//             className="bus-form-modal"
//             open={open}
//             onClose={handleClose}
//             aria-labelledby="modal-modal-title"
//             aria-describedby="modal-modal-description"
//           >
//             <div className="bus-form-container">
//               <form onSubmit={update ? handleUpdate : handleSubmit}>
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     marginBottom: "20px",
//                   }}
//                 >
//                   <h3>{update ? "Update Firm" : "Add Firm"}</h3>
//                   <RxCrossCircled
//                     className="bus-form-cross"
//                     onClick={handleClose}
//                   />
//                 </div>

//                 <div className="data-input-fields">
//                   <div className="bus-input-label">
//                     <label className="input-label">Firm Name</label>
//                     <TextField
//                       className="bus-input"
//                       margin="dense"
//                       type="text"
//                       fullWidth
//                       name="firmName"
//                       id="firmName"
//                       value={formData.firmName}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </div>

//                   <div className="bus-input-label">
//                     <label className="input-label">Firm Type</label>
//                     <Select
//                       fullWidth
//                       name="firmType"
//                       value={formData.firmType}
//                       onChange={handleInputChange}
//                       required
//                     >
//                       {firmType.map((type) => (
//                         <MenuItem key={type.value} value={type.value}>
//                           {type.label}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </div>
//                 </div>
//                 <div className="data-input-fields">
//                   <div className="bus-input-label">
//                     <label className="input-label">GST Number</label>
//                     <TextField
//                       className="bus-input"
//                       margin="dense"
//                       type="text"
//                       fullWidth
//                       name="gstNumber"
//                       id="gstNumber"
//                       value={formData.gstNumber}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </div>

//                   <div className="bus-input-label">
//                     <label className="input-label">GST Address</label>
//                     <TextField
//                       className="bus-input"
//                       margin="dense"
//                       type="text"
//                       fullWidth
//                       name="gstAddress"
//                       id="gstAddress"
//                       value={formData.gstAddress}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </div>
//                 </div>
//                 <div className="data-input-fields">
//                   <div className="bus-input-label">
//                     <label className="input-label">PAN/TAN Number</label>
//                     <TextField
//                       className="bus-input"
//                       margin="dense"
//                       type="text"
//                       fullWidth
//                       name="panTanNumber"
//                       id="panTanNumber"
//                       value={formData.panTanNumber}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </div>

//                   <div className="bus-input-label">
//                     <label className="input-label">Proprietor Name</label>
//                     <TextField
//                       className="bus-input"
//                       margin="dense"
//                       type="text"
//                       fullWidth
//                       name="propertiorName"
//                       id="propertiorName"
//                       value={formData.propertiorName}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="submit-firm-button">
//                   <Button
//                     type="submit"
//                     variant="contained"
//                     color="primary"
//                     disabled={isSubmitting} // Disable button when submitting
//                   >
//                     {isSubmitting ? <CircularProgress size={20} /> : update ? "Update" : "Submit"}
//                   </Button>
//                 </div>
//               </form>
//             </div>
//           </Modal>

//           <div className="firm-table-container">
//             <TableContainer component={Paper}>
//               <Table stickyHeader aria-label="sticky table">
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Firm Name</TableCell>
//                     <TableCell>Firm Type</TableCell>
//                     <TableCell>GST Number</TableCell>
//                     <TableCell>GST Address</TableCell>
//                     <TableCell>PAN/TAN Number</TableCell>
//                     <TableCell>Proprietor Name</TableCell>
//                     <TableCell>Action</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {getFirm
//                     ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                     .map((firm: any) => (
//                       <TableRow key={firm._id}>
//                         <TableCell>{firm.firmName}</TableCell>
//                         <TableCell>{firm.firmType}</TableCell>
//                         <TableCell>{firm.gstNumber}</TableCell>
//                         <TableCell>{firm.gstAddress}</TableCell>
//                         <TableCell>{firm.panTanNumber}</TableCell>
//                         <TableCell>{firm.propertiorName}</TableCell>
//                         <TableCell>
//                           <FaEdit
//                             onClick={() => updateClick(firm._id)}
//                             style={{
//                               fontSize: "20px",
//                               color: "blue",
//                               cursor: "pointer",
//                               marginRight: "10px",
//                             }}
//                           />
//                           <MdDelete
//                             onClick={() => deleteClick(firm._id)}
//                             style={{
//                               fontSize: "20px",
//                               color: "red",
//                               cursor: "pointer",
//                             }}
//                           />
//                           {isDeleting && <CircularProgress size={20} />}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//             <TablePagination
//               component="div"
//               count={getFirm?.length || 0}
//               page={page}
//               onPageChange={handleChangePage}
//               rowsPerPage={rowsPerPage}
//               onRowsPerPageChange={handleChangeRowsPerPage}
//             />
//           </div>
//         </>
//       )}
//     </section>
//   );
// };

// export default FirmsTable;
