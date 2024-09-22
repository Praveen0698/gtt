import React from "react";
import LoginPage from "./components/LoginPage";

const HomePage = () => {
  return <LoginPage />;
};

export default HomePage;
// "use client";

// import axios from "axios";
// import React, { useState } from "react";
// import Papa from "papaparse";
// import axios from "axios";

// const UploadCSV = () => {
//   const [csvData, setCsvData] = useState(null);

//   const handleFileChange = (e: any) => {
//     const file = e.target.files[0];
//     if (file) {
//       Papa.parse(file, {
//         header: true, // Ensure the first row is used as keys for the JSON objects
//         skipEmptyLines: true,
//         complete: (result: any) => {
//           console.log(result.data); // This logs the parsed CSV data
//           setCsvData(result.data); // Save the JSON data in state
//         },
//         error: (error: any) => {
//           console.error("Error parsing CSV file:", error);
//         },
//       });
//     }
//   };

//   const handleUpload = async () => {
//     if (csvData) {
//       try {
//         const response = await axios.post("/api/upload-csv", { data: csvData }); // Sending JSON to server API
//         console.log("Upload successful:", response.data);
//       } catch (error) {
//         console.error("Error uploading CSV data:", error);
//       }
//     }
//   };

//   return (
//     <div>
//       <input type="file" accept=".csv" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Upload CSV</button>
//     </div>
//   );
// };

// export default UploadCSV;
