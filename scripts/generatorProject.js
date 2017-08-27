
hexo.extend.generator.register('project', function(locals) {
    return locals.projects.map(function(project) {
        return {
            path: project.path,
            data: project,
            layout: 'project'
        };
    });
});
