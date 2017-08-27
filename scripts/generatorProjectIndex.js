var pagination = require('hexo-pagination');

hexo.extend.generator.register('project_index', function(locals) {
    return pagination('/project', locals.projects, {
        format: 'page/%d/',
        layout: 'project_index'
    });
});