var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	notify = require('gulp-notify'),
	cache = require('gulp-cache'),
	cleanCSS = require('gulp-clean-css'),
	livereload = require('gulp-livereload'),
	babel = require('gulp-babel'),
	del = require('del');

var paths = {
		  styles: {
		    src: 'src/styles/**/*.scss',
		    dest: 'dist/css'
		  },
		  scripts: {
		    src: 'src/scripts/**/*.js',
		    dest: 'dist/js'
		  },
		  images: {
		    src: 'src/images/**/*.js',
		    dest: 'dist/img'
		  }
	};
	// 压缩打包css文件
	function styles() {
		return gulp.src(paths.styles.src)
		    .pipe(sass().on('error', sass.logError))
		    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		    .pipe(cleanCSS())
		    // pass in options to the stream
		    .pipe(rename({
		      basename: 'main',
		      suffix: '.min'
		    }))
		    .pipe(gulp.dest(paths.styles.dest))
		    .pipe(notify({ message: 'Styles task complete' }));
	}
	// 压缩打包js文件
	function scripts() {
		return gulp.src(paths.scripts.src, { sourcemaps: true })
		    .pipe(babel({							// 转译es6，否则uglify 会报错
	            presets: ['env']
	        }))
		    .pipe(jshint('.jshintrc'))				// 校验 js语法
		    .pipe(jshint.reporter('default'))
		    .pipe(concat('main.min.js'))
		    .pipe(uglify())							// 压缩js	
		    .pipe(gulp.dest(paths.scripts.dest))
		    .pipe(notify({ message: 'Scripts task complete' })); // 编译完成 发消息通知
	}

	// 压缩打包图片文件
	function images(){
		return gulp.src(paths.images.src)
			.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))		// 打包压缩图片
			.pipe(gulp.dest(paths.images.dist))													// 生成图片文件夹和图片文件				
			.pipe(notify({ message: 'Images task complete' }));
	}
	// 清理已生成的文件，文件夹
	function clean() {
	  // You can use multiple globbing patterns as you would with `gulp.src`,
	  // for example if you are using del 2.0 or above, return its promise
	  return del([ 'dist' ]);
	}
	var build = gulp.series(clean, gulp.parallel(styles, scripts, images));
	// 设置默认任务
	gulp.task('default',build);