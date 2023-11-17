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
        <span className="bg-light inline-flex cursor-pointer items-center justify-center gap-2 rounded-full pl-2 pr-2 text-sm transition hover:bg-slate-900">
            <Icon icon={tag.icon} /> {tag.tag}
        </span>
    );
};

export default ProjectTechIcon;
