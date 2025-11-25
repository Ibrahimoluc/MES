import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

// Operator Pages
import OperatorHomePage from "./pages/operator/OperatorHomePage";
import OperatorWorkorderPage from "./pages/operator/OperatorWorkorderPage";
import OperatorWorkorderDetailPage from "./pages/operator/OperatorWorkorderDetailPage";
import OperatorScadaPage from "./pages/operator/OperatorScadaPage";
import Deneme from "./pages/operator/Deneme";

// Manager Pages
import ManagerHomePage from "./pages/manager/ManagerHomePage";
import ManagerTrackWorkerPage from "./pages/manager/ManagerTrackWorkerPage";
import WorkstationPerfLogsPage from "./pages/manager/WorkstationPerfLogsPage";
import ManagerWorkstationDetailsPage from "./pages/manager/ManagerWorkstationDetailsPage";
import PerfLogsPage from "./pages/manager/PerfLogsPage";

// MPS Pages
//import MpsPanel from "./pages/mps/MpsPanel";
import MpsPanel2 from "./pages/mps/MpsPanel2";
import CreateProductPage from "./pages/mps/CreateProductPage";
import CreateWorkorderPage from "./pages/mps/CreateWorkorderPage";
import CreateWorkstationPage from "./pages/mps/CreateWorkstationPage";

// Layout
import MainLayout from "./components/layouts/MainLayout";
import WorkorderListPage from "./components/WorkorderListPage";


const getUserRole = () => localStorage.getItem("role");

const ProtectedRoute = ({ children, allowedRoles }) => {
    const role = getUserRole();
    return allowedRoles.includes(role) ? children : <Navigate to="/" />;
};

console.log("api:" + process.env.REACT_APP_API_URL)
const App = () => {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />

            {/* Operator Panel */}
            <Route
                path="/operator"
                element={
                    <ProtectedRoute allowedRoles={["operator"]}>
                        <MainLayout><OperatorHomePage /></MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/operator/workorders"
                element={
                    //<ProtectedRoute allowedRoles={["operator"]}>
                        <MainLayout><OperatorWorkorderPage /></MainLayout>
                    //</ProtectedRoute>
                }
            />


            <Route
                path="/operator/workorders/:workorderId"
                element={
                    //<ProtectedRoute allowedRoles={["operator"]}>
                        <MainLayout><OperatorWorkorderDetailPage /></MainLayout>
                    //</ProtectedRoute>
                }
            />
            <Route
                path="/operator/scada"
                element={
                    //<ProtectedRoute allowedRoles={["operator"]}>
                    <MainLayout><OperatorScadaPage /></MainLayout>
                    //</ProtectedRoute>
                }
            />


            <Route
                path="/operator/deneme"
                element={
                    //<ProtectedRoute allowedRoles={["operator"]}>
                    <MainLayout><Deneme /></MainLayout>
                    //</ProtectedRoute>
                }
            />

            {/* Manager Panel */}
            <Route
                path="/manager"
                element={
                    //<ProtectedRoute allowedRoles={["manager"]}>
                        <MainLayout><ManagerHomePage /></MainLayout>
                    //</ProtectedRoute>
                }
            />
            <Route
                path="/manager/workstations"
                element={
                    //<ProtectedRoute allowedRoles={["manager"]}>
                        <MainLayout><ManagerWorkstationDetailsPage /></MainLayout>
                    //</ProtectedRoute>
                }
            />
            <Route
                path="/manager/workers"
                element={
                    //<ProtectedRoute allowedRoles={["manager"]}>
                        <MainLayout><ManagerTrackWorkerPage /></MainLayout>
                    //</ProtectedRoute>
                }
            />

            <Route
                path="/manager/workorder/perflogs"
                element={
                    //<ProtectedRoute allowedRoles={["operator"]}>
                    <MainLayout><PerfLogsPage /></MainLayout>
                    //</ProtectedRoute>
                }
            />

            <Route
                path="/manager/workstation/perflogs"
                element={
                    //<ProtectedRoute allowedRoles={["operator"]}>
                    <MainLayout><WorkstationPerfLogsPage /></MainLayout>
                    //</ProtectedRoute>
                }
            />

            <Route
                path="/manager/workordersList"
                element={
                    <MainLayout><WorkorderListPage /></MainLayout>
                }
            />

            {/* MPS Panel */}
            {/*<Route*/}
            {/*    path="/mps"*/}
            {/*    element={*/}
            {/*        //<ProtectedRoute allowedRoles={["mps"]}>*/}
            {/*            <MainLayout><MpsPanel /></MainLayout>*/}
            {/*        //</ProtectedRoute>*/}
            {/*    }*/}
            {/*/>*/}
            <Route
                path="/mps"
                element={
                    //<ProtectedRoute allowedRoles={["mps"]}>
                    <MainLayout><MpsPanel2 /></MainLayout>
                    //</ProtectedRoute>
                }
            />

            <Route
                path="/mps/createProduct"
                element={
                    //<ProtectedRoute allowedRoles={["mps"]}>
                    <MainLayout><CreateProductPage /></MainLayout>
                    //</ProtectedRoute>
                }
            />

            <Route
                path="/mps/createWorkorder"
                element={
                    //<ProtectedRoute allowedRoles={["mps"]}>
                    <MainLayout><CreateWorkorderPage /></MainLayout>
                    //</ProtectedRoute>
                }
            />

            <Route
                path="/mps/createWorkstation"
                element={
                    //<ProtectedRoute allowedRoles={["mps"]}>
                    <MainLayout><CreateWorkstationPage /></MainLayout>
                    //</ProtectedRoute>
                }
            />
        </Routes>
    );
};

export default App;
