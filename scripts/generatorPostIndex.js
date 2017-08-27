var pagination = require('hexo-pagination');

hexo.extend.generator.register('post_index', function(locals) {
    return pagination('/post', locals.posts, {
        format: 'page/%d/',
        layout: 'post_index'
    });
});
