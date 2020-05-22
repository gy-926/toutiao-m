/**  PostCSS配置文件 */
module.exports = {
  // 配置要使用的PostCSS插件
  plugins: {
    // 配置使用autoprefixer 插件
    //   作用：生成浏览器css样式规则前缀
    // 重启报错，vuecli内部配置了autoprefixer 产生了冲突  注释就可以了
    // 'autoprefixer': {
    //   // 配置要兼容的环境信息
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },
    // 配置使用postcss-pxtorem插件
    // 作用：把px转为rem
    'postcss-pxtorem': {
      // 把一行分为10份  每份就是十分之一 rootvalue 设置为 设计稿跨度的十分之一
      // 本次设计稿为750px
      // vant建议为37.5   缺点  设计稿尺寸要除2
      // 查询文档         rootvalue支持两种类型  数字型  固定的数值  函数  可以动态处理返回
      // postcss-pxtorem 处理每个 CSS 文件的时候都会来调用这个函数
      //  它会把被处理的 CSS 文件相关的信息通过参数传递给该函数
      rootValue ({
        file
      }) {
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },

      //   rootValue: 37.5,
      // 配置要转换的css属性
      // 星号 表示所有属性
      propList: ['*'],
      // 配置不要转换的样式资源
      exclude: 'github-markdown'
    }
  }
}
