import {useCallback, useEffect, useRef, useState} from "react";
import mapboxgl from "mapbox-gl";
import {v4} from 'uuid';
import {Subject} from "rxjs";

mapboxgl.accessToken = 'pk.eyJ1IjoiYW50b25pb3ZpbGxlZ2FzIiwiYSI6ImNsaTEyZWY0cDBmNW4zbXBjcmJ5cW9raWEifQ.udDtSWzzMJE-Q33mS8hsPg';
export const useMapBox = (puntoInicial) => {

    const mapaDiv = useRef();
    // Guardamos la referencia al mapa
    const setRef = useCallback(
        (node) => {
            mapaDiv.current = node;
        },
        [],
    );

    // Referencia a los marcadores
    const marcadores = useRef({});


    // Observables de Rxjs
    const movimientoMarcador = useRef(new Subject());
    const nuevoMarcador = useRef(new Subject());


    const mapa = useRef();
    const [coords, setCoords] = useState(puntoInicial);


    // funcion para agregar marcadores memorizada
    const agregarMarcador = useCallback(
        (ev) => {
            const {lng, lat} = ev.lngLat

            const marker = new mapboxgl.Marker();
            marker.id = v4();  // todo: si el marccador tiene id

            marker
                .setLngLat([lng, lat])
                .addTo(mapa.current)
                .setDraggable(true)

            // asiganamos al objeto de markadores
            marcadores.current[marker.id] = marker;



            // todo: si el marcador tiene ID no emitir
            nuevoMarcador.current.next( {
                id: marker.id,
                lng,
                lat
            } )

            // Escuchar mobimientos del marcador
            marker.on('drag', ({target}) => {
                const {id} = target
                const {lng, lat} = target.getLngLat()

                movimientoMarcador.current.next({
                    id,
                    lng,
                    lat
                })
            })

        },
        [],
    );


    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapaDiv.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [puntoInicial.lng, puntoInicial.lat],
            zoom: puntoInicial.zoom
        });

        mapa.current = map;

    }, [puntoInicial]);


    // Cuando se mueve el mapa
    useEffect(() => {
        mapa.current?.on('move', () => {
            const {lng, lat} = mapa.current.getCenter();
            setCoords({
                lng: lng.toFixed(4),
                lat: lat.toFixed(4),
                zoom: mapa.current.getZoom().toFixed(4)
            })
        })
        return () => {
            mapa.current?.off('move')
        };
    }, []);


    // Agregar marcadores cuando haga click
    useEffect(() => {
        mapa.current?.on('click', agregarMarcador)
    }, [agregarMarcador]);


    return {
        agregarMarcador,
        coords,
        marcadores,
        nuevoMarcador$: nuevoMarcador.current,
        movimientoMarcador$: movimientoMarcador.current,
        setRef,
    }
};

