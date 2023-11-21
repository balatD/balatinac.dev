'use client';

import React from 'react';
import { useEffect, useRef } from 'react';
import Globe from "react-globe.gl";

const GlobeDecoration = () => {
    const globeEl = useRef();

    useEffect(() => {
        // @ts-ignore
        globeEl.current.controls().autoRotate = true;
        // @ts-ignore
        globeEl.current.controls().autoRotateSpeed = 1.5;
        // @ts-ignore
        globeEl.current.controls().enableZoom = false;
    }, []);

    const pointsData = [
        {
            lat: 51.4556,
            lng: 7.0116,
            size: 1,
            color: 'red',
            label: 'Essen',
        },
    ];

    return (
        <div className="globe-center absolute z-50 overflow-hidden opacity-50">
            <Globe
                ref={globeEl}
                backgroundColor={'rgba(0,0,0,0)'}
                width={1000}
                height={1000}
                showAtmosphere={true}
                atmosphereColor={'#898E85'}
                atmosphereAltitude={0.5}
                globeImageUrl={'./globe-texture.png'}
            />
        </div>
    );
};

export default GlobeDecoration;
