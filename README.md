### 关于 Minimal

> Minimal 简介、优雅、尊贵。一款能展示项目的主题， 致无私的开源贡献者。

### 演示地址

[前往演示地址](http://blog.ckryo.com/)

### 安装

在终端窗口下，定位到 Hexo 站点目录下。使用 Git checkout 代码：
```
$ cd your-hexo-site
$ git clone https://github.com/ckryo/hexo-theme-minimal themes/minimal
```

### 启用主题

与所有 Hexo 主题启用的模式一样。 当 `git clone` 完成后，打开 站点 **配置文件** ， 找到 theme 字段，并将其值更改为 `minimal`。

```
theme: minimal
```
如果您的电脑中尚未安装所需要的程序，请根据以下安装指示完成安装。

## 主题设定
以下是主题配置文件项目说明：

```ymal
site:
  logo: 网站logo - 文字logo
  title: 网站标题

banner: 网站上部 - 导航下面banner 区域样式
  title: 自定义显示标题
  description: 副标题
  background_image: 背景图片

author: 网站侧边栏的作者信息
  avatar: 头像图片地址
  nick: 昵称
  description: 个人简介

menu: 导航菜单
  首页: /
  项目: /project/index.html
  文章: /post/index.html
  关于我: /about.html
  Minimal: /project/2016/04/28/hexo-minimal.html

menu_icons: 导航菜单图标
  Minimal: tachometer

# 集成第三方服务
vendors:
  baidu_analytics: 百度统计

  # 社会化评论， 畅言
  changyan:
    enable: true
    app_id: cysYE5nWR
    conf: prod_ea59e8a942c2c4c0e72b24ed00ecddc9

```

其它配置项说明：
1. 项目目录
	
	定位到 `your-hexo-site-path/source` 目录下, 新增 `_projects` 文件目录； 将项目文章放置到该文件目录下即可。

2. Front-matter
	
	```
	# 公共属性
	preview: 类缩图
	comments: 是否添加评论

	# project属性
	date: 项目创建时间
	description: 项目描述
	home_url: 项目主页
	demo_url: 演示地址 or 下载链接
	```


## 致歉
由于目前精力有限，该项目还有诸多不足之处，包括`分类页`,`标签云`等，还请各位海涵，在以后的时间里，将会不断更新完善。
同时也接受各种形式的贡献，包括不限于提交问题与需求，修复代码。等待您的Pull Request。
