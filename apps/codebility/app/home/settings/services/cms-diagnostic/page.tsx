import { createClientServerComponent } from "@/utils/supabase/server";

export default async function CMSDiagnosticPage() {
  const supabase = await createClientServerComponent();

  // Get ALL projects (including non-public ones)
  const { data: allProjects, error: allError } = await supabase
    .from('projects')
    .select(`
      id,
      name,
      public_display,
      main_image,
      description,
      categories:project_categories(
        projects_category(
          id,
          name,
          description
        )
      )
    `)
    .order('name');

  // Get only PUBLIC projects
  const { data: publicProjects, error: publicError } = await supabase
    .from('projects')
    .select(`
      id,
      name,
      public_display,
      main_image,
      description,
      categories:project_categories(
        projects_category(
          id,
          name,
          description
        )
      )
    `)
    .eq('public_display', true)
    .order('name');

  if (allError || publicError) {
    return <div>Error loading projects</div>;
  }

  const allProjectsFlat = allProjects?.map((project: any) => ({
    ...project,
    categories: project.categories?.map((cat: any) => cat.projects_category).filter(Boolean) || [],
  }));

  const publicProjectsFlat = publicProjects?.map((project: any) => ({
    ...project,
    categories: project.categories?.map((cat: any) => cat.projects_category).filter(Boolean) || [],
  }));

  // Filter for projects that might be CMS-related
  const allCMSProjects = allProjectsFlat?.filter((p: any) =>
    p.categories?.some((c: any) => c.id === 4) ||
    p.name?.toLowerCase().includes('cms') ||
    p.description?.toLowerCase().includes('cms') ||
    p.description?.toLowerCase().includes('content management')
  );

  const publicCMSProjects = publicProjectsFlat?.filter((p: any) =>
    p.categories?.some((c: any) => c.id === 4)
  );

  const strictCMSCategory = allProjectsFlat?.filter((p: any) =>
    p.categories?.some((c: any) => c.id === 4)
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">CMS Projects Diagnostic</h1>

      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Projects</div>
          <div className="text-3xl font-bold">{allProjectsFlat?.length || 0}</div>
        </div>
        <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">Public Projects</div>
          <div className="text-3xl font-bold">{publicProjectsFlat?.length || 0}</div>
        </div>
        <div className="p-4 bg-orange-100 dark:bg-orange-900 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">CMS Projects (Category 4)</div>
          <div className="text-3xl font-bold">{strictCMSCategory?.length || 0}</div>
          <div className="text-xs mt-1">Public: {publicCMSProjects?.length || 0}</div>
        </div>
      </div>

      <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <h2 className="font-semibold text-lg mb-2">🔍 CMS-Related Projects Found ({allCMSProjects?.length || 0})</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Projects with Category 4 (CMS) OR containing "CMS" or "Content Management" in name/description
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Strict Category 4 (CMS) Projects</h2>
          {strictCMSCategory && strictCMSCategory.length > 0 ? (
            <div className="space-y-3">
              {strictCMSCategory.map((project: any) => (
                <div key={project.id} className="p-4 border rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{project.name}</h3>
                      <div className="mt-2 flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          project.public_display
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {project.public_display ? '✓ Public' : '✗ Not Public'}
                        </span>
                        {project.categories?.map((cat: any) => (
                          <span
                            key={cat.id}
                            className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                          >
                            {cat.name} (ID: {cat.id})
                          </span>
                        ))}
                      </div>
                    </div>
                    {project.main_image ? (
                      <img src={project.main_image} alt="" className="w-24 h-24 object-cover rounded ml-4" />
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded ml-4 flex items-center justify-center text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No projects with Category 4 (CMS) found</p>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">All CMS-Related Projects (including name/description matches)</h2>
          {allCMSProjects && allCMSProjects.length > 0 ? (
            <div className="space-y-3">
              {allCMSProjects.map((project: any) => {
                const hasCategory4 = project.categories?.some((c: any) => c.id === 4);
                const hasNameMatch = project.name?.toLowerCase().includes('cms');
                const hasDescMatch = project.description?.toLowerCase().includes('cms') ||
                                     project.description?.toLowerCase().includes('content management');

                return (
                  <div key={project.id} className="p-4 border rounded-lg dark:border-gray-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{project.name}</h3>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              project.public_display
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {project.public_display ? 'Public' : 'Not Public'}
                            </span>
                            {hasCategory4 && (
                              <span className="px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                                ✓ Has Category 4
                              </span>
                            )}
                            {hasNameMatch && (
                              <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                "CMS" in name
                              </span>
                            )}
                            {hasDescMatch && (
                              <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                "CMS" in description
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {project.categories?.length > 0 ? (
                              project.categories.map((cat: any) => (
                                <span
                                  key={cat.id}
                                  className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                >
                                  {cat.name} (ID: {cat.id})
                                </span>
                              ))
                            ) : (
                              <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                NO CATEGORIES
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {project.main_image ? (
                        <img src={project.main_image} alt="" className="w-20 h-20 object-cover rounded ml-4" />
                      ) : (
                        <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded ml-4 flex items-center justify-center text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No CMS-related projects found</p>
          )}
        </div>
      </div>
    </div>
  );
}
