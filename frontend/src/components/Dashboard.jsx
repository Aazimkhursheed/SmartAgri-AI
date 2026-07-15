import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState({});
  const [history, setHistory] = useState([]);

  const email = localStorage.getItem("email");

  useEffect(() => {
    if (email) {
      fetchDashboard();
      fetchHistory();
    }
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/dashboard/${email}`
      );

      setDashboard(res.data || {});
    } catch (err) {
      console.error("Dashboard Error:", err);
      setDashboard({});
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/crop-history/${email}`
      );

      console.log("Crop History Response:", res.data);

      // Handles both:
      // { history: [...] }
      // and [...]
      if (Array.isArray(res.data)) {
        setHistory(res.data);
      } else if (Array.isArray(res.data?.history)) {
        setHistory(res.data.history);
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error("History Error:", err);
      setHistory([]);
    }
  };

  const chartData = (history || []).map((item, index) => ({
    name: `P${index + 1}`,
    temperature: Number(item.temperature) || 0,
    humidity: Number(item.humidity) || 0,
  }));

  return (
    <div className="dashboard-container">
      {/* TOP CARDS */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Total Predictions</h3>
          <p>{dashboard?.total_crop_predictions || 0}</p>
        </div>

        <div className="dashboard-card">
          <h3>Disease Scans</h3>
          <p>{dashboard?.total_disease_scans || 0}</p>
        </div>

        <div className="dashboard-card">
          <h3>Preferred Crop</h3>
          <p>{dashboard?.profile?.preferred_crop || "N/A"}</p>
        </div>
      </div>

      {/* CHART */}
      <div className="dashboard-chart">
        <h2>📈 Crop Analytics</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip />

            <Bar
              dataKey="temperature"
              fill="#22c55e"
              radius={[8, 8, 0, 0]}
            />

            <Bar
              dataKey="humidity"
              fill="#3b82f6"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* HISTORY TABLE */}
      <div className="dashboard-history">
        <h2>🕘 Recent Predictions</h2>

        <table>
          <thead>
            <tr>
              <th>Crop</th>
              <th>Temp</th>
              <th>Humidity</th>
              <th>Rainfall</th>
            </tr>
          </thead>

          <tbody>
            {history.length > 0 ? (
              history.map((item, index) => (
                <tr key={index}>
                  <td>{item.prediction || "N/A"}</td>
                  <td>{item.temperature || 0}</td>
                  <td>{item.humidity || 0}</td>
                  <td>{item.rainfall || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No prediction history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


// import { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// export default function Dashboard() {
//   const [dashboard, setDashboard] = useState(null);
//   const [history, setHistory] = useState([]);

//   const email = localStorage.getItem("email");

//   useEffect(() => {
//     fetchDashboard();
//     fetchHistory();
//   }, []);

//   const fetchDashboard = async () => {
//     try {
//       const res = await axios.get(
//         `http://127.0.0.1:8000/dashboard/${email}`
//       );

//       setDashboard(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const fetchHistory = async () => {
//     try {
//       const res = await axios.get(
//         `http://127.0.0.1:8000/crop-history/${email}`
//       );

//       setHistory(res.data.history);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const chartData = history.map((item, index) => ({
//     name: `P${index + 1}`,
//     temperature: item.temperature,
//     humidity: item.humidity,
//   }));

//   return (
//     <div className="dashboard-container">

//       {/* TOP CARDS */}
//       <div className="dashboard-cards">

//         <div className="dashboard-card">
//           <h3>Total Predictions</h3>
//           <p>{dashboard?.total_crop_predictions || 0}</p>
//         </div>

//         <div className="dashboard-card">
//           <h3>Disease Scans</h3>
//           <p>{dashboard?.total_disease_scans || 0}</p>
//         </div>

//         <div className="dashboard-card">
//           <h3>Preferred Crop</h3>
//           <p>
//             {dashboard?.profile?.preferred_crop || "N/A"}
//           </p>
//         </div>
//       </div>

//       {/* CHART */}
//       <div className="dashboard-chart">

//         <h2>📈 Crop Analytics</h2>

//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={chartData}>
//             <XAxis dataKey="name" stroke="#9ca3af" />
//             <YAxis stroke="#9ca3af" />
//             <Tooltip />

//             <Bar
//               dataKey="temperature"
//               fill="#22c55e"
//               radius={[8, 8, 0, 0]}
//             />

//             <Bar
//               dataKey="humidity"
//               fill="#3b82f6"
//               radius={[8, 8, 0, 0]}
//             />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       {/* HISTORY TABLE */}
//       <div className="dashboard-history">

//         <h2>🕘 Recent Predictions</h2>

//         <table>
//           <thead>
//             <tr>
//               <th>Crop</th>
//               <th>Temp</th>
//               <th>Humidity</th>
//               <th>Rainfall</th>
//             </tr>
//           </thead>

//           <tbody>
//             {history.map((item, index) => (
//               <tr key={index}>
//                 <td>{item.prediction}</td>
//                 <td>{item.temperature}</td>
//                 <td>{item.humidity}</td>
//                 <td>{item.rainfall}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//     </div>
//   );
// }