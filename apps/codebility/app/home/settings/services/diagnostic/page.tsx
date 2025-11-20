import { createClientServerComponent } from "@/utils/supabase/server";

export default async function DiagnosticPage() {
  const supabase = await createClientServerComponent();

  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
      id,
      name,
      public_display,
      main_image,
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

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const projectsWithCategories = projects?.map((project: any) => ({
    ...project,
    categories: project.categories?.map((cat: any) => cat.projects_category).filter(Boolean) || [],
  }));

  // Count by category
  const webCount = projectsWithCategories?.filter((p: any) => p.categories?.some((c: any) => c.id === 1)).length || 0;
  const mobileCount = projectsWithCategories?.filter((p: any) => p.categories?.some((c: any) => c.id === 2)).length || 0;
  const designCount = projectsWithCategories?.filter((p: any) => p.categories?.some((c: any) => c.id === 3)).length || 0;
  const cmsCount = projectsWithCategories?.filter((p: any) => p.categories?.some((c: any) => c.id === 4)).length || 0;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Project Categories Diagnostic</h1>

      <div className="mb-8 grid grid-cols-4 gap-4">
        <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">Web (ID: 1)</div>
          <div className="text-3xl font-bold">{webCount}</div>
        </div>
        <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">Mobile (ID: 2)</div>
          <div className="text-3xl font-bold">{mobileCount}</div>
        </div>
        <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">Design (ID: 3)</div>
          <div className="text-3xl font-bold">{designCount}</div>
        </div>
        <div className="p-4 bg-orange-100 dark:bg-orange-900 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">CMS (ID: 4)</div>
          <div className="text-3xl font-bold">{cmsCount}</div>
        </div>
      </div>

      <div className="space-y-4">
        {projectsWithCategories?.map((project: any) => (
          <div key={project.id} className="p-4 border rounded-lg dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{project.name}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.categories && project.categories.length > 0 ? (
                    project.categories.map((cat: any) => (
                      <span
                        key={cat.id}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          cat.id === 1 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          cat.id === 2 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          cat.id === 3 ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                          cat.id === 4 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}
                      >
                        {cat.name} (ID: {cat.id})
                      </span>
                    ))
                  ) : (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      NO CATEGORIES
                    </span>
                  )}
                </div>
              </div>
              <div className="ml-4 flex items-center gap-2">
                {project.main_image ? (
                  <>
                    <span className="text-green-600 dark:text-green-400 text-sm">✓ Has Image</span>
                    <img src={project.main_image} alt="" className="w-16 h-16 object-cover rounded" />
                  </>
                ) : (
                  <span className="text-red-600 dark:text-red-400 text-sm">✗ No Image</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="font-semibold mb-2">Total Projects: {projectsWithCategories?.length || 0}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This page shows all projects with public_display=true and their assigned categories.
        </p>
      </div>
    </div>
  );
}
