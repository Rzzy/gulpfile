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
		    src: 'src/images/**/*',
		    dest: 'dist/img'
		  }
	};
	// 压缩打包css文件
	gulp.task('styles',function() {
		return gulp.src(paths.styles.src,{ sourcemaps: true })
		    .pipe(sass().on('error', sass.logError))
		    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		    // pass in options to the stream
		    .pipe(gulp.dest(paths.styles.dest))
		    .pipe(cleanCSS())  // .pipe(minifycss())  压缩css代码
		    .pipe(rename({
		      basename: 'main',
		      suffix: '.min'
		    }))
		    .pipe(gulp.dest(paths.styles.dest))
		    .pipe(notify({ message: 'Styles task complete' }));
	})
	// 压缩打包js文件
	gulp.task('scripts',function() {
		return gulp.src(paths.scripts.src, { sourcemaps: true })
		    .pipe(babel({							// 转译es6，否则uglify 会报错
	            presets: ['env']
	        }))
		    .pipe(jshint('.jshintrc'))				// 校验 js语法
		    .pipe(jshint.reporter('default'))
		    .pipe(concat('main.js'))
		    .pipe(gulp.dest(paths.scripts.dest))
		    .pipe(uglify())							// 压缩js
		    .pipe(rename({suffix: '.min'}))         // 重命名 添加后缀	
		    .pipe(gulp.dest(paths.scripts.dest))
		    .pipe(notify({ message: 'Scripts task complete' })); // 编译完成 发消息通知
	})

	// 压缩打包图片文件
	gulp.task('images',function(){
		return gulp.src(paths.images.src)
			.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))		// 打包压缩图片
			.pipe(gulp.dest(paths.images.dest))													// 生成图片文件夹和图片文件				
			.pipe(notify({ message: 'Images task complete' }));
	})
	// 清理已生成的文件，文件夹
	gulp.task('clean',function(){
	  // You can use multiple globbing patterns as you would with `gulp.src`,
	  // for example if you are using del 2.0 or above, return its promise
	  return del([ 'dist/css','dist/img', 'dist/js' ]);
	})
	
	// 设置默认任务
	gulp.task('default',['clean'],function(){
		gulp.start('styles', 'scripts', 'images');
	});