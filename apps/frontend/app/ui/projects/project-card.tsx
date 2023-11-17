import React from 'react';
import { FiArrowUpRight } from 'react-icons/fi';
import { Project } from '@/lib/definitions';
import ProjectTechIcon from '@/ui/projects/project-tech-icon';

interface ProjectCardProps {
    project: Project;
};

const ProjectCard = ({ project }: ProjectCardProps) => {
    return (
        <article className='hover:shadow-md hover:shadow-lighterDark flex flex-col text-white border p-10 border-grey/[.55] rounded-lg hover:bg-lighterDark transition-all'>
            <div className='mb-5 gap-2 flex flex-wrap'>
                {project.attributes.tags && project.attributes.tags.map((tag) => <ProjectTechIcon key={tag.id} tag={tag.tag} icon={tag.icon} />)}
            </div>
            <h5 className='text-3xl mb-5'>{project.attributes.name}</h5>
            <p>{project.attributes.shortDescription}</p>
            <div className='mt-10'>
                {project.attributes.githubLink &&
                    <a href={project.attributes.githubLink} target='_blank' className='pt-3 pb-3 flex gap-4 items-center hover:underline'>
                        Take me to the repository <FiArrowUpRight />
                    </a>
                }
                {project.attributes.websiteLink &&
                    <a href={project.attributes.websiteLink} target='_blank' className='pt-3 pb-3 flex gap-4 items-center hover:underline'>
                        Take me to the website <FiArrowUpRight />
                    </a>
                }
            </div>
        </article>
    )
}

export default ProjectCard