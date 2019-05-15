/**
 * Category list page generator
 */
module.exports = function (hexo) {
    hexo.extend.generator.register('categories', function (locals) {
        return {
            path: 'kategoriler/',
            layout: ['categories'],
            data: Object.assign({}, locals, {
                __categories: true
            })
        };
    });
}