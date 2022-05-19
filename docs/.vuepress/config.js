module.exports = {
    title: 'jsbox', // 标题
    description: 'js在线编辑运行沙盒环境', // 描述
    dest: './docs/doc/', // 基本url
    base: '/jsbox/doc/',
    // 注入到当前页面的 HTML <head> 中的标签
    head: [
        ['link', {rel: 'icon', href: 'https://fastly.jsdelivr.net/gh/theajack/cnchar/docs/assets/v1/images/i.ico'}], // 增加一个自定义的 favicon
    ],
    // dest: './dist', //打包位置
    port: 6868, // 端口号 谐音流弊流弊

    // 主题配置
    themeConfig: {
        // 顶部导航栏配置
        nav: [
            {text: '主页', link: '/'}, // 内部链接 以docs为根目录
            {text: '使用说明', link: '/guide/'},
            {text: 'GitHub', link: 'https://www.github.com/theajack/cnchar'},
            {
                text: '文档',
                // 这里是下拉列表展现形式。
                items: [
                    {text: 'cnchar', link: '/doc/cnchar'},
                    {text: 'cnchar-poly', link: '/doc/poly'},
                    {text: 'cnchar-order', link: '/doc/order'},
                    {text: 'cnchar-trad', link: '/doc/trad'},
                    {text: 'cnchar-draw', link: '/doc/draw'},
                ],
            },
            {
                text: '关于作者',
                items: [
                    {text: 'GitHub地址', link: 'https://www.github.com/theajack'}, // 外部链接
                    {text: 'Gitee地址', link: 'http://www.gitee.com/theajack'},
                    {
                        text: 'CSDN账号',
                        link: 'https://blog.csdn.net/yanxiaomu',
                    },
                ],
            },
        ],
        // 这里使用的是多个侧边栏设置
        sidebar: {
            // 如果你不需要文档版本功能，只需去掉2.0，1.0文件夹，将md文件直接放在components文件夹下
            '/doc/': [
                {
                    title: 'cnchar文档', // 必要的
                    path: '', // 如果你不想'基础组件'可点击并有对应说明，就直接设为空，或者不写,并且nav的link也不要指向 '/components/2.0/'而是'/components/2.0/catButton'
                    collapsable: false, // 可选的, 右侧侧边栏是否展开,默认值是 true
                    // 如果组件很多时，建议将children配置单独放到一个js文件中，然后进行引入
                    children: [
                        {
                            title: 'cnchar',
                            path: 'cnchar',
                        },
                        {
                            title: 'cnchar-poly',
                            path: 'poly',
                        },
                        {
                            title: 'cnchar-order',
                            path: 'order',
                        },
                        {
                            title: 'cnchar-trad',
                            path: 'trad',
                        },
                        {
                            title: 'cnchar-draw',
                            path: 'draw',
                        },
                    ],
                },
            ],
            '/guide/': [
                {
                    title: '使用说明',
                    path: '',
                    collapsable: false,
                    children: [
                        {
                            title: '简介',
                            path: './',
                        },
                        {
                            title: '快速上手',
                            path: 'start',
                        },
                        {
                            title: '更新日志',
                            path: 'version',
                        },
                    ],
                },
            ],
        },
        sidebarDepth: 1, // 将同时提取markdown中h2，显示在侧边栏上
        lastUpdated: '最后更新于', // 文档更新时间：每个文件git最后提交的时间
    },

    markdown: {
        // lineNumbers: true // 代码块显示行号
    },

    plugins: [
        // 官方回到顶部插件
        '@vuepress/back-to-top',

        // 官方图片放大组件 目前是所有img都可以点击放大。具体配置见https://v1.vuepress.vuejs.org/zh/plugin/official/plugin-medium-zoom.html
        ['@vuepress/medium-zoom', {selector: 'img'}],

        // // vssue 一个借助issue的评论插件 具体配置见https://vssue.js.org/zh/
        // [
        //     '@vssue/vuepress-plugin-vssue',
        //     {
        //         // 设置 `platform` 而不是 `api` 我这里是在github平台
        //         platform: 'gitee',

        //         // owner与repo配置 https://github.com/${owner}/${repo}
        //         // 例如我的仓库地址为https://github.com/1011cat/shotCat_doc 则owner为1011cat，repo为shotCat_doc
        //         owner: 'theajack',
        //         repo: 'cnchar',

        //         // 填写自己的OAuth App 信息。详见https://vssue.js.org/zh/options/#repo
        //         clientId:
        //             'xx',
        //         clientSecret:
        //             'xx',
        //         locale: 'zh', // 使用的语言  这里是简体中文
        //         baseURL: 'https://gitee.com', // 平台的 base URL
        //     },
        // ], // 平台的 base URL
        [
            'vuepress-plugin-comment',
            {
                choosen: 'valine',
                // options选项中的所有参数，会传给Valine的配置
                options: {
                    el: '#vcomments',
                    appId: 'XyNxA2qBeTwpGkL6gsOGJh10-gzGzoHsz',
                    appKey: 'TmWkhzEI7YrFqtYuT0axnlrv',
                    notify: false,
                    verify: false,
                    avatar: 'mp',
                    placeholder: '留下点什么吧...'
                }
            }
        ]
    ],

    // vuepress里修改webpack配置，使用的是chainWebpack进行链式调用
    // 具体使用可以参考我这个例子和 https://github.com/neutrinojs/webpack-chain/tree/v5
    // chainWebpack: (config, isServer) => {
    //   config.resolve.alias
    //     .set('@',resolve('src'))
    // }
};
