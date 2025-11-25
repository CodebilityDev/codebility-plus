"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Project, ProjectMember } from "@/types/home/codev";
import { defaultAvatar } from "@/public/assets/images";
import { createClientClientComponent } from "@/utils/supabase/client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@codevs/ui/tabs";

interface InternalProjectsProps {
  // We'll receive projects from the parent component
}

export default function InternalProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>("");

  useEffect(() => {
    fetchInternalProjects();
  }, []);

  const fetchInternalProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const supabase = createClientClientComponent();
      
      // First, let's see what clients exist (for debugging)
      const { data: allClients, error: allClientsError } = await supabase
        .from('clients')
        .select('id, name')
        .limit(10);
        
      console.log('Available clients:', allClients);
      
      // Try to find Codebility client with various patterns
      const { data: clients, error: clientError } = await supabase
        .from('clients')
        .select('id, name')
        .or('name.ilike.%codebility%,name.ilike.%Codebility%,name.ilike.%CODEBILITY%')
        .limit(1);

      if (clientError) {
        console.error('Error finding client:', clientError);
        throw new Error('Failed to find client');
      }

      console.log('Found Codebility clients:', clients);

      // If no Codebility client found, try to get internal projects another way
      if (!clients || clients.length === 0) {
        // Alternative: fetch all projects and filter by name patterns
        const { data: allProjects, error: projectsError } = await supabase
          .from('projects')
          .select(`
            *,
            project_members (
              id,
              role,
              joined_at,
              codev (
                id,
                first_name,
                last_name,
                image_url
              )
            )
          `)
          .or('name.ilike.%tapup%,name.ilike.%applete%,name.ilike.%codebility%,name.ilike.%portal%,name.ilike.%sariverse%')
          .not('name', 'ilike', '%design%')
          .not('name', 'ilike', '%product%')
          .order('created_at', { ascending: false });

        if (projectsError) {
          console.error('Error fetching projects:', projectsError);
          throw new Error('Failed to fetch projects');
        }

        console.log('Found internal projects by name:', allProjects);
        console.log('Project names:', allProjects?.map(p => p.name));
        setProjects(allProjects || []);
        return;
      }

      const codebilityClientId = clients[0].id;

      // Now fetch all projects for this client with their members
      const { data: projectsData, error: projectError } = await supabase
        .from('projects')
        .select(`
          *,
          project_members (
            id,
            role,
            joined_at,
            codev (
              id,
              first_name,
              last_name,
              image_url
            )
          )
        `)
        .eq('client_id', codebilityClientId)
        .not('name', 'ilike', '%design%')
        .not('name', 'ilike', '%product%')
        .order('created_at', { ascending: false });

      if (projectError) {
        console.error('Error fetching projects:', projectError);
        throw new Error('Failed to fetch projects');
      }

      console.log('Projects for Codebility client:', projectsData);
      console.log('Project names from Codebility client:', projectsData?.map(p => p.name));
      
      setProjects(projectsData || []);
      
      // Set first project as selected by default
      if (projectsData && projectsData.length > 0) {
        setSelectedProject(projectsData[0].id || projectsData[0].name || '');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Get member count for a single project
  const getProjectMemberCount = (project: Project) => {
    return project.project_members?.length || 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600 dark:text-gray-400">Loading internal projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-600 dark:text-red-400">Error: {error}</div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600 dark:text-gray-400">No internal projects found.</div>
      </div>
    );
  }

  // Get selected project
  const selectedProjectData = projects.find(p => p.id === selectedProject || p.name === selectedProject);

  return (
    <div className="space-y-8">
      {/* Dynamic Project Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {projects.map((project) => {
          const memberCount = getProjectMemberCount(project);
          const projectKey = project.id || project.name || '';
          
          return (
            <button
              key={projectKey}
              onClick={() => setSelectedProject(projectKey)}
              className={`px-4 py-2 rounded-lg transition-all text-sm ${
                selectedProject === projectKey
                  ? "border-2 border-customBlue-500 text-customBlue-500 font-medium"
                  : "border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500"
              }`}
            >
              <span>{project.name}</span>
              <span className="ml-1 text-xs">
                ({memberCount})
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Team Members View */}
      <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-8">
        {selectedProjectData && (
          <TeamMembersView project={selectedProjectData} />
        )}
      </div>
    </div>
  );
}

function TeamMembersView({ project }: { project: Project }) {
  // Get all members from the project
  const members = project.project_members || [];
  
  if (members.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No team members found for {project.name}.</p>
      </div>
    );
  }

  const leaders = members.filter(m => m.role === 'team_leader');
  const regularMembers = members.filter(m => m.role !== 'team_leader');

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {project.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {members.length} team member{members.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Team Leaders */}
      {leaders.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <span className="text-2xl mr-2">👑</span> Team Leader{leaders.length > 1 ? 's' : ''}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {leaders.map((member) => (
              <MemberCard key={member.id} member={member} projectName={project.name || ''} isLead={true} />
            ))}
          </div>
        </div>
      )}

      {/* Team Members */}
      {regularMembers.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <span className="text-2xl mr-2">💻</span> Developers
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {regularMembers.map((member) => (
              <MemberCard key={member.id} member={member} projectName={project.name || ''} isLead={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MemberCard({ member, projectName, isLead }: { member: ProjectMember, projectName: string, isLead: boolean }) {
  const memberName = member.codev 
    ? `${member.codev.first_name || ''} ${member.codev.last_name || ''}`.trim()
    : 'Unknown Member';

  return (
    <div className="group relative">
      <div className="flex flex-col items-center p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-customBlue-500 dark:hover:border-customBlue-400 transition-all hover:shadow-lg cursor-pointer">
        <div className={`relative ${isLead ? 'ring-2 ring-yellow-500 ring-offset-2' : ''} rounded-full`}>
          {member.codev?.image_url ? (
            <Image
              src={member.codev.image_url}
              alt={memberName}
              width={80}
              height={80}
              className="rounded-full object-cover w-20 h-20"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-semibold text-xl">
                {memberName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
          )}
          {isLead && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-xs">👑</span>
            </div>
          )}
        </div>
        <h5 className="mt-3 font-medium text-sm text-gray-900 dark:text-gray-100 text-center">
          {member.codev?.first_name}
        </h5>
        {member.role && member.role !== 'member' && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {member.role.replace('_', ' ')}
          </p>
        )}
      </div>
      
      {/* Hover tooltip with member details */}
      <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 max-w-xs">
          <p className="font-semibold mb-1">{memberName}</p>
          <p className="text-gray-300">{projectName}</p>
          {member.role && <p className="text-gray-400">Role: {member.role.replace('_', ' ')}</p>}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MemberBadge({ member }: { member: ProjectMember }) {
  const memberName = member.codev 
    ? `${member.codev.first_name || ''} ${member.codev.last_name || ''}`.trim()
    : 'Unknown Member';

  return (
    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-full px-3 py-1.5">
      {member.codev?.image_url ? (
        <Image
          src={member.codev.image_url}
          alt={memberName}
          width={20}
          height={20}
          className="rounded-full object-cover"
        />
      ) : (
        <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-600" />
      )}
      <span className="text-xs text-gray-700 dark:text-gray-300">
        {memberName}
      </span>
      {member.role && member.role !== 'member' && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          ({member.role})
        </span>
      )}
    </div>
  );
}