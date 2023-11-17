import React from 'react';
import { FiArrowUpRight } from 'react-icons/fi';
import { Project } from '@/lib/definitions';
import ProjectTechIcon from '@/ui/projects/project-tech-icon';

interface ProjectCardProps {
    project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
    return (
        <article className="hover:shadow-lighterDark border-grey/[.55] hover:bg-lighterDark flex flex-col rounded-lg border p-10 text-white transition-all hover:shadow-md">
            <div className="mb-5 flex flex-wrap gap-2">
                {project.attributes.tags &&
                    project.attributes.tags.map((tag) => (
                        <ProjectTechIcon
                            key={tag.id}
                            tag={tag.tag}
                            icon={tag.icon}
                        />
                    ))}
            </div>
            <h5 className="mb-5 text-3xl">{project.attributes.name}</h5>
            <p>{project.attributes.shortDescription}</p>
            <div className="mt-10">
                {project.attributes.githubLink && (
                    <a
                        href={project.attributes.githubLink}
                        target="_blank"
                        className="flex items-center gap-4 pb-3 pt-3 hover:underline"
                    >
                        Take me to the repository <FiArrowUpRight />
                    </a>
                )}
                {project.attributes.websiteLink && (
                    <a
                        href={project.attributes.websiteLink}
                        target="_blank"
                        className="flex items-center gap-4 pb-3 pt-3 hover:underline"
                    >
                        Take me to the website <FiArrowUpRight />
                    </a>
                )}
            </div>
        </article>
    );
};

export default ProjectCard;
