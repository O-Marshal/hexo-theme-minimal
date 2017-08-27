
hexo.extend.filter.register('before_post_render', function(data) {
    var photos = data._content.match(/\!\[.*?\]\(.*?\)/g);
    if (photos) {
        data.photos = photos.map(function(item) {
            return item.replace(/\!\[.*?\]\(/g, '').replace(/\)/g, '');
        });
    } else {
        data.photos = [];
    }

    // 添加预览图获取方式 Front-matter 可以设置 preview ， 其次从文章中获取首图 ，再次使用默认图
    if (data.preview) return data._preview = data.preview;
    data.__defineGetter__('preview', function() {
        if (this._preview && typeof this._preview == "string") return this._preview;
        if (this.photos.length > 0) return this.photos[0];
        return '/images/post_preview_default.jpg';
    });

    

    return data;
});