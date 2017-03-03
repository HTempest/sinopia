module.exports.pagiPackages = function (req,packages) {
    // 分页参数
    var totalItem = packages.length;
    var page = req.query.page || req.body.page;
    var pageSize = req.query.pageSize || req.body.pageSize;
    var pagi_packages;
    //有参数时将packges分段
    if (page && pageSize) {
        // 计算总页数
        var totalPage = Math.ceil(totalItem / pageSize);
        //若请求页超过最大页，默认赋值最大页
        if (page > totalPage) {
            page = totalPage;
        }
        //若请求页<=0，默认赋值第一页
        if (page <= 0) {
            page = 1;
        }
        var _start = pageSize * (page - 1);
        var _end = pageSize * page;
        pagi_packages = packages.slice(_start, _end);

    }
    //无参数时默认传输所有
    else {
        pagi_packages = packages;
    }
    var result={
        pagi_packages:pagi_packages,
        totalPage:totalPage,
        page:page,
        pageSize:pageSize

    }
    return result;
}