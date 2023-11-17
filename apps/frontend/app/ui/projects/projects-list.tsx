import React from 'react';
import ProjectCard from '@/ui/projects/project-card';
import { fetchAllProjects } from '@/lib/data';
import type { Project } from '@/lib/definitions';

const ProjectList = async () => {
    const projects = await fetchAllProjects();

    return (
        <div className="border-grey/[.55] border-b pb-32" id="projects">
            <div className="ml-10 mr-10 mt-32 flex flex-col content-center">
                <h2 className="mb-10">
                    <a
                        className="hover:decoration-3 text-5xl font-semibold text-white hover:underline"
                        href="#projects"
                    >
                        Projects
                    </a>
                </h2>
                {projects.data && (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
                        {projects?.data.map((project: Project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectList;
