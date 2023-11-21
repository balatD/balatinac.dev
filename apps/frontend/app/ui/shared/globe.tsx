'use client';

import React from 'react';
import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const Globe = dynamic(
    () => import('react-globe.gl').then((mod) => mod.default),
    {
        ssr: false,
    }
);

const GlobeDecoration = () => {
    const globeElement = useRef();

    useEffect(() => {
        const globe = globeElement.current;

        if (globe) {
            // @ts-ignore
            globe.controls().autoRotate();
        }
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
        <div className="globe-center absolute z-50 overflow-hidden">
            <Globe
                ref={globeElement}
                backgroundColor={'rgba(0,0,0,0)'}
                width="1000"
                height="1000"
                pointsData={pointsData}
                showAtmosphere={false}
                globeImageUrl={'./earth-dark.jpg'}
                bumpImageUrl={'./earth-topology.png'}
            />
        </div>
    );
};

export default GlobeDecoration;
