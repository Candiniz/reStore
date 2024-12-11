'use client';

import { useState, useEffect } from 'react';
import { User, createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Tipagem para os dados dos projetos
interface ProjectsData {
  totalProjects: number;
  projectsRemaining: number;
}

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [projectsInfo, setProjectsInfo] = useState<ProjectsData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      } else {
        setUser(user);
      }
    };

    const fetchProjectsData = async () => {
      try {
        const response = await fetch('/api/supabase/count');
        if (!response.ok) {
          throw new Error('Erro ao buscar dados dos projetos');
        }
        const data: ProjectsData = await response.json();
        setProjectsInfo(data);
      } catch (error) {
        console.error('Erro ao carregar os dados dos projetos:', error);
      }
    };

    Promise.all([fetchUser(), fetchProjectsData()]).finally(() => setLoading(false));
  }, [supabase]);

  // Handle logout
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/'); // Redireciona para a página inicial
  };

  if (loading) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16 rounded-full border-[1px] border-gray-300">
          <AvatarImage src="/avatars/male1.png" alt="Foto de Perfil" />
          <AvatarFallback>
            {user?.email?.charAt(0).toUpperCase() || '?'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">{user?.email?.split('@')[0]}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Projetos do Usuário</h3>
        {projectsInfo ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Projetos já realizados: <span className="font-semibold">{projectsInfo.totalProjects}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Projetos faltando para alcançar 5: <span className="font-semibold">{projectsInfo.projectsRemaining}</span>
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhum projeto encontrado.</p>
        )}
      </div>

      <div className="space-y-4">
        <Button onClick={handleSignOut} className="w-full">
          Sair da Conta
        </Button>
        <Link href="/" className="text-sm text-blue-500 hover:underline">
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
}
