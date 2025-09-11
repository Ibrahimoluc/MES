import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

// Operator Pages
import OperatorHomePage from "./pages/operator/OperatorHomePage";
import OperatorWorkorderPage from "./pages/operator/OperatorWorkorderPage";
import OperatorWorkorderDetailPage from "./pages/operator/OperatorWorkorderDetailPage";
import OperatorScadaPage from "./pages/operator/OperatorScadaPage";
import OperatorScadaPage2 from "./pages/operator/OperatorScadaPage2";
import OperatorWorkorderPage2 from "./pages/operator/OperatorWorkorderPage2";
import OperatorHomePage2 from "./pages/operator/OperatorHomePage2";



// Manager Pages
import ManagerHomePage from "./pages/manager/ManagerHomePage";
import ManagerTrackWorkerPage from "./pages/manager/ManagerTrackWorkerPage";
import ManagerWorkstationDetailsPage from "./pages/manager/ManagerWorkstationDetailsPage";

// MPS Page (tek sayfa var)
//import MpsPanel from "./pages/mps/MpsPanel";
import MpsPanel2 from "./pages/mps/MpsPanel2";


// Layout
import MainLayout from "./components/layouts/MainLayout";
import Deneme from "./pages/operator/Deneme";
import CreateProductPage from "./pages/mps/CreateProductPage";
import CreateWorkorderPage from "./pages/mps/CreateWorkorderPage";
import PerfLogsPage from "./pages/manager/PerfLogsPage";
import ManagerHomePage2 from "./pages/manager/ManagerHomePage2";
import WorkstationPerfLogsPage from "./pages/manager/WorkstationPerfLogsPage";


const getUserRole = () => localStorage.getItem("role");

const ProtectedRoute = ({ children, allowedRoles }) => {
    const role = getUserRole();
    return allowedRoles.includes(role) ? children : <Navigate to="/" />;
};

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
                path="/operator2"
                element={
                    //<ProtectedRoute allowedRoles={["operator"]}>
                    <MainLayout><OperatorHomePage2 /></MainLayout>
                    //</ProtectedRoute>
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
                path="/operator/workorders2"
                element={
                    //<ProtectedRoute allowedRoles={["operator"]}>
                    <MainLayout><OperatorWorkorderPage2 /></MainLayout>
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
                path="/operator/scada2"
                element={
                    //<ProtectedRoute allowedRoles={["operator"]}>
                    <MainLayout><OperatorScadaPage2 /></MainLayout>
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
                        <MainLayout><ManagerHomePage2 /></MainLayout>
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
        </Routes>
    );
};

export default App;
