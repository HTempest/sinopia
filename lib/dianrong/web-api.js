var async = require('async');
var _ = require('lodash');
var pagination = require('./pagination');
var Search = require('../search');

exports.createRouter = function(config, auth, storage, app) {
	/**
	 * 列表接口
	 */
	app.get('/-wfh/packages', function(req, res) {
		var base = config.url_prefix ?
			config.url_prefix.replace(/\/$/, '') :
			req.protocol + '://' + req.get('host');
		storage.get_local(function(err, packages) {
			if (err) throw err;
			async.filterSeries(packages, function(package, cb) {
				auth.allow_access(package.name, req.remote_user, function(err, allowed) {
					setImmediate(function() {
						if (err) {
							cb(null, false);
						} else {
							cb(err, allowed);
						}
					});
				});
			}, function(err, packages) {
				if (err) throw err;
				//排除category为internal的包
				var selectPackages = _.filter(packages, function(package) {
					var get = _.get(package, 'dr.category');					
					if (!_.includes([].concat(get), 'internal')) {
						return true;
					}
				});
				selectPackages.sort(function(p1, p2) {
					//按日期倒序排列	
					if (p2.date < p1.date) {
						return -1;
					} else {
						return 1;
					}
				});
				//分页处理				
				var pagiResult = pagination.pagiPackages(req, selectPackages);
				res.send({
					name: config.web && config.web.title ? config.web.title : 'Verdaccio',
					packages: pagiResult.pagiPackages,
					baseUrl: base,
					username: req.remote_user.name,
					totalPage: pagiResult.totalPage,
					page: pagiResult.page,
					pageSize: pagiResult.pageSize
				});
			});
		});
	});

	/**
	 * 搜索接口
	 */
	app.get('/-wfh/search/:anything', function(req, res, next) {
		var results = Search.query(req.params.anything);
		var packages = [];
		var getData = function(i) {
			storage.get_package(results[i].ref, function(err, entry) {
				if (!err && entry) {
					packages.push(entry.versions[entry['dist-tags'].latest]);
				}
				if (i >= results.length - 1) {
					packages.sort(function (p1, p2) {
						//按日期倒序排列	
						if (p2.date < p1.date) {
							return -1;
						} else {
							return 1;
						}
					});
					//分页处理
					var pagiResult = pagination.pagiPackages(req, packages);					
					res.send({
						packages: pagiResult.pagiPackages,
						totalPage: pagiResult.totalPage,
						page: pagiResult.page,
						pageSize: pagiResult.pageSize
					});
				} else {
					getData(i + 1);
				}
			});
		};

		if (results.length) {
			getData(0);
		} else {
			res.send([]);
		}
	});

	/**
	 * 自定义条件查询接口
	 */
	app.get('/-wfh/select/:by/:value', function(req, res, next) {
		var by = req.params.by;
		var byValue = req.params.value;
		if (!by || !byValue) {
			res.send({
				'error': 'param must be complete,/-wfh/select/:by/:value'
			});
		}
		var base = config.url_prefix ?
			config.url_prefix.replace(/\/$/, '') :
			req.protocol + '://' + req.get('host');
		storage.get_local(function(err, packages) {
			if (err) throw err;
			async.filterSeries(packages, function(package, cb) {
				auth.allow_access(package.name, req.remote_user, function(err, allowed) {
					setImmediate(function() {
						if (err) {
							cb(null, false);
						} else {
							cb(err, allowed);
						}
					});
				});
			}, function(err, packages) {
				if (err) throw err;
				//根据条件筛选结果
				var selectPackages = _.filter(packages, function(package) {
					var get = _.get(package, by);
					if (_.includes([].concat(get), byValue)) {
						return true;
					}
				});
				selectPackages.sort(function(p1, p2) {
					//按日期倒序排列	
					if (p2.date < p1.date) {
						return -1;
					} else {
						return 1;
					}
				});
				//分页处理				
				var pagiResult = pagination.pagiPackages(req, selectPackages);
				res.send({
					name: config.web && config.web.title ? config.web.title : 'Verdaccio',
					packages: pagiResult.pagiPackages,
					baseUrl: base,
					username: req.remote_user.name,
					totalPage: pagiResult.totalPage,
					page: pagiResult.page,
					pageSize: pagiResult.pageSize
				});
			});
		});
	});
};
