import {useMapBox} from "../hooks/useMapBox.js";
import {useEffect} from "react";


const puntoInicial = {
    lng: -122.4619,
    lat:37.7948 ,
    zoom:13.5
}
const MapaPage = () => {
    const {setRef,coords,nuevoMarcador$, movimientoMarcador$} = useMapBox(puntoInicial);


    useEffect(() => {
        nuevoMarcador$.subscribe( marcador =>{
            console.log(marcador)
        })
    }, [nuevoMarcador$]);


    useEffect(() => {

        movimientoMarcador$.subscribe(marcador => {
            console.log(marcador.id)
        })
    }, [movimientoMarcador$]);




    return (
        <>
            <div className="info">
                Lng: {coords.lng} | Lat: {coords.lat} | Zoom: { coords.zoom}
            </div>
            <div ref={setRef} className="mapContainer">
                Mapa
            </div>
        </>
    );
};

export default MapaPage;
