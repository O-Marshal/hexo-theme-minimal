
hexo.extend.generator.register('post', function(locals) {
    return locals.posts.map(function(post) {
        return {
            path: post.path,
            data: post,
            layout: 'post'
        };
    });
});
