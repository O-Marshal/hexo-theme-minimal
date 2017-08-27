'use strict';

var common = require('hexo/lib/plugins/processor/common');
var yfm = require('hexo-front-matter');
var Promise = require('bluebird');
var pathFn = require('path');
var util = require('hexo-util');
var slugize = util.slugize;
var Permalink = util.Permalink;

var permalink;

var preservedKeys = {
    title: true,
    year: true,
    month: true,
    day: true,
    i_month: true,
    i_day: true
};

// 浏览文件
function scanAssetDir(post) {
    if (!hexo.config.post_asset_folder) return;

    var assetDir = post.asset_dir;
    var baseDir = hexo.base_dir;
    var baseDirLength = baseDir.length;
    var PostAsset = hexo.model('PostAsset');

    return fs.stat(assetDir).then(function(stats) {
        if (!stats.isDirectory()) return [];

        return fs.listDir(assetDir);
    }).catch(function(err) {
        if (err.cause && err.cause.code === 'ENOENT') return [];
        throw err;
    }).filter(function(item) {
        return !common.isTmpFile(item) && !common.isHiddenFile(item);
    }).map(function(item) {
        var id = pathFn.join(assetDir, item).substring(baseDirLength).replace(/\\/g, '/');
        var asset = PostAsset.findById(id);
        if (asset) return;

        return PostAsset.save({
            _id: id,
            post: post._id,
            slug: item,
            modified: true
        });
    });
}

// 给文件命名
function parseFilename(config, path) {
    config = config.substring(0, config.length - pathFn.extname(config).length);
    path = path.substring(0, path.length - pathFn.extname(path).length);

    if (!permalink || permalink.rule !== config) {
        permalink = new Permalink(config, {
            segments: {
                year: /(\d{4})/,
                month: /(\d{2})/,
                day: /(\d{2})/,
                i_month: /(\d{1,2})/,
                i_day: /(\d{1,2})/
            }
        });
    }

    var data = permalink.parse(path);

    if (data) {
        return data;
    }

    return {
        title: slugize(path)
    };
}


function processPost(file) {
    if (file.params[0] != file.path) return;
    var Post = hexo.model('Post');
    var db_key = file.path;
    var path = db_key.replace('_projects/', '');
    var config = hexo.config;
    var timezone = config.timezone;
    var categories, tags;
    
    return Promise.all([
        file.stat(),
        file.read()
    ]).spread(function(stats, content) {
        var data = yfm(content);
        var info = parseFilename(config.new_post_name, path);
        var keys = Object.keys(info);
        var key;

        data.source = db_key;
        data.raw = content;
        data.slug = info.title;
        data.is_project = true;

        if (file.params.published) {
            if (!data.hasOwnProperty('published')) data.published = true;
        } else {
            data.published = false;
        }

        for (var i = 0, len = keys.length; i < len; i++) {
            key = keys[i];
            if (!preservedKeys[key]) data[key] = info[key];
        }

        if (data.date) {
            data.date = common.toDate(data.date);
        } else if (info && info.year && (info.month || info.i_month) && (info.day || info.i_day)) {
            data.date = new Date(
                info.year,
                parseInt(info.month || info.i_month, 10) - 1,
                parseInt(info.day || info.i_day, 10)
            );
        }

        if (data.date) {
            if (timezone) data.date = common.timezone(data.date, timezone);
        } else {
            data.date = stats.birthtime;
        }

        data.updated = common.toDate(data.updated);

        if (data.updated) {
            if (timezone) data.updated = common.timezone(data.updated, timezone);
        } else {
            data.updated = stats.mtime;
        }

        if (data.category && !data.categories) {
            data.categories = data.category;
            delete data.category;
        }

        if (data.tag && !data.tags) {
            data.tags = data.tag;
            delete data.tag;
        }

        categories = data.categories || [];
        tags = data.tags || [];

        if (!Array.isArray(categories)) categories = [categories];
        if (!Array.isArray(tags)) tags = [tags];

        if (data.photo && !data.photos) {
            data.photos = data.photo;
            delete data.photo;
        }

        if (data.photos && !Array.isArray(data.photos)) {
            data.photos = [data.photos];
        }

        if (data.link && !data.title) {
            data.title = data.link.replace(/^https?:\/\/|\/$/g, '');
        }

        if (data.permalink) {
            data.slug = data.permalink;
            delete data.permalink;
        }

        // FIXME: Data may be inserted when reading files. Load it again to prevent
        // race condition. We have to solve this in warehouse.
        var doc = Post.findOne({ source: db_key });

        if (doc) {
            return doc.replace(data);
        }

        return Post.insert(data);
    }).then(function(doc) {
        return Promise.all([
            doc.setCategories(categories),
            doc.setTags(tags),
            scanAssetDir(doc)
        ]);
    });
}

hexo.extend.processor.register('_projects/*.md', processPost);
