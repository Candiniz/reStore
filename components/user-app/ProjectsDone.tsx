'use client'

import { useEffect, useState } from 'react';

interface ProjectsData {
  totalProjects: number;
  projectsRemaining: number;
}

export default function UserProjects() {
  const [projectsInfo, setProjectsInfo] = useState<ProjectsData | null>(null);

  useEffect(() => {
    const fetchProjectsData = async () => {
      try {
        const response = await fetch('/api/supabase/count');
        if (!response.ok) {
          throw new Error('Erro ao buscar dados dos projetos');
        }
        const data: ProjectsData = await response.json();
        setProjectsInfo(data);
      } catch (error) {
        console.error('Erro ao carregar os dados:', error);
      }
    };

    fetchProjectsData();
  }, []);

  if (!projectsInfo) {
    return <div>Carregando...</div>;
  }
  console.log(projectsInfo.totalProjects)
  return (
    <div>
      <h3>Projetos Restaurados</h3>
      <p>Projetos já feitos: {projectsInfo.totalProjects}</p>
      <p>Projetos faltando para alcançar 5: {projectsInfo.projectsRemaining}</p>
    </div>
  );
}
