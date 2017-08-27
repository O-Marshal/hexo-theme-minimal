hexo.extend.helper.register('recent_posts', function() {
    return hexo.locals.get('posts').sort('date', -1).limit(3);
});

hexo.extend.helper.register('recent_projects', function() {
    return hexo.locals.get('recent_projects');
});

hexo.extend.helper.register('recent_project_tags', function() {
    return hexo.locals.get('recent_project_tags');
});

hexo.extend.helper.register('post_abstract', function(post) {
    if (post.excerpt) {
        return post.excerpt.replace(/<[^>]*>|/g, "");
    }
    return post.content.replace(/<[^>]*>|/g, "");
});

hexo.extend.helper.register('get_project', function(post) {
    return hexo.locals.get('projects').find({ _id: post._id });
});


hexo.extend.helper.register('get_content', function(post) {
    if (post.content) return post.content;
    var stripIndent = require('strip-indent');
    var util = require('hexo-util');
    var highlight = util.highlight;
    var config = hexo.config.highlight;
    var options = {
        autoDetect: config.auto_detect,
        gutter: config.line_number,
        tab: config.tab_replace
    };

    return post.content = hexo.render.renderSync({ text: post._content, engine: 'md' }, {
        highlight: function(code) {
            return highlight(stripIndent(code), options)
                .replace(/{/g, '&#123;')
                .replace(/}/g, '&#125;');
        }
    }).replace(/<pre><code.*?>/g, '').replace(/<\/code><\/pre>/g, '');
});