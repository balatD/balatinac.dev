import React from 'react';
import { DiTypo3, DiPhp, DiJavascript1 } from 'react-icons/di';
import { SiTailwindcss, SiStrapi } from 'react-icons/si';
import { TbBrandNextjs } from 'react-icons/tb';

const Icon = (icon: { icon: string }) => {
    switch (icon.icon) {
        case 'typo3':
            return <DiTypo3 />;
        case 'php':
            return <DiPhp />;
        case 'javascript':
            return <DiJavascript1 />;
        case 'tailwind':
            return <SiTailwindcss />;
        case 'strapi':
            return <SiStrapi />;
        case 'next.js':
            return <TbBrandNextjs />;
    }
};

const ProjectTechIcon = (tag: { tag: string; icon: string }) => {
    return (
        <span className="inline-flex bg-light rounded-full items-center justify-center pr-2 pl-2 text-sm gap-2 hover:bg-slate-900 transition cursor-pointer">
            <Icon icon={tag.icon} /> {tag.tag}
        </span>
    );
};

export default ProjectTechIcon;
