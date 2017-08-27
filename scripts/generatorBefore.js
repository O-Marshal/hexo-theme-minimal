var stripIndent = require('strip-indent');
var util = require('hexo-util');
var highlight = util.highlight;

var highlight_config = hexo.config.highlight;
var highlight_options = {
    autoDetect: highlight_config.auto_detect,
    gutter: highlight_config.line_number,
    tab: highlight_config.tab_replace
};

hexo.on('generateBefore', function() {
    var Post = hexo.model('Post');

    var projects = Post.filter(function(item) {
        return item.is_project;
    });
    projects.forEach(function(item) {
        // 将project的默认布局设置为 project
        if (item.layout == 'post') item.layout = 'project';

        // 添加预览图获取方式 Front-matter 可以设置 preview ， 其次从文章中获取首图 ，再次使用默认图
        if (item.preview) return item._preview = item.preview;
        item.__defineGetter__('preview', function() {
            if (item._preview) return item._preview;
            return '/images/project_preview_default.jpg';
        });

        item.content = hexo.render.renderSync({ text: item._content, engine: 'md' }, {
            highlight: function(code) {
                return highlight(stripIndent(code), highlight_options)
                    .replace(/{/g, '&#123;')
                    .replace(/}/g, '&#125;');
            }
        }).replace(/<pre><code.*?>/g, '').replace(/<\/code><\/pre>/g, '');
    });

    hexo.locals.set('projects', projects);



    var recent_projects = hexo.locals.get('projects').sort('date', -1).limit(12);
    var recent_project_tags = [];
    var recent_project_tag_temps = {};
    recent_projects.forEach(function(item) {

        item.tag_group = "[" + item.tags.map(function(tag) {
            return '"' + tag._id + '"';
        }).toString() + "]";
        item.tag_label = item.tags.map(function(tag) {
            return tag.name;
        }).toString();

        item.tags.forEach(function(tag) {
            if (recent_project_tag_temps[tag._id]) {
                recent_project_tag_temps[tag._id].count += 1;
            } else {
                recent_project_tag_temps[tag._id] = {
                    id: tag._id,
                    name: tag.name,
                    count: 1
                };
            }
        });
    });

    for (i in recent_project_tag_temps) {
        recent_project_tags.push(recent_project_tag_temps[i]);
    }
    recent_project_tag_temps = null;
    recent_project_tags = recent_project_tags.sort(function(a, b) {
        return a.count < b.count;
    });
    hexo.locals.set('recent_projects', recent_projects);
    hexo.locals.set('recent_project_tags', recent_project_tags);

});
