var pagination = require('hexo-pagination');

hexo.extend.generator.register('post_index', function(locals) {
    return pagination('/post', locals.posts.sort('date', -1), {
        format: 'page/%d/',
        layout: 'post_index'
    });
});
