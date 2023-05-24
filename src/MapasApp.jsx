import MapaPage from "./pages/MapaPage.jsx";
import {SocketProvider} from "./context/SocketContext.jsx";


const MapasApp = () => {
    return (
        <>
            <SocketProvider>
                <MapaPage/>
            </SocketProvider>
        </>
    );
};

export default MapasApp;
