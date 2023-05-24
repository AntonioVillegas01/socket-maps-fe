import {useMapBox} from "../hooks/useMapBox.js";
import {useContext, useEffect} from "react";
import {SocketContext} from "../context/SocketContext.jsx";


const puntoInicial = {
    lng: -122.4619,
    lat:37.7948 ,
    zoom:13.5
}
const MapaPage = () => {
    const {setRef,coords,nuevoMarcador$, movimientoMarcador$,agregarMarcador,actualizarPosicion} = useMapBox(puntoInicial);
    const {socket} = useContext(SocketContext);

    // Escuchar marcadores existentes

    useEffect(() => {

        socket.on('marcadores-activos', (marcadores)=>{
            console.log(marcadores);

            for (const key  of Object.keys(marcadores)){
                console.log(marcadores[key])
                agregarMarcador(marcadores[key], key)
            }

        })
    }, []);


    // emitir nuevo marker al BAcke-end
    useEffect(() => {
        nuevoMarcador$.subscribe( marcador =>{
            socket.emit('marcador-nuevo', marcador,)
        })

    }, [nuevoMarcador$]);


    // emitir movimiento
    useEffect(() => {
        movimientoMarcador$.subscribe(marcador => {
            // console.log(marcador.id)
            socket.emit('marcador-actualizado', marcador)
        })
    }, [movimientoMarcador$]);


    // escuchar nuevos marcadores
    useEffect(() => {
        socket.on('marcador-nuevo',(marcador => {
            // console.log(marcador)
            // se renderiza nuevo marker  al  agregar marcador
            agregarMarcador(marcador,marcador.id)
        }))
    }, [agregarMarcador, socket]);


    //escuchar movimiento de marcador

    useEffect(() => {
        socket.on('marcador-actualizado', marcador=>{
            actualizarPosicion(marcador)
        })
    }, []);





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
