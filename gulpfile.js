const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();

const defaults = {
    htmlSource: './',
    sassSource: './sass/',
    cssSource: './css/',
};

gulp.task('sass', () => {
    return gulp
        .src(defaults.sassSource + '**/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(
            autoprefixer(
                'last 2 version',
                'safari 10',
                'ie 10',
                'opera 12.1',
                'ios 9',
                'android 4',
            ),
        )
        .pipe(gulp.dest(defaults.cssSource))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cleanCSS())
        .pipe(gulp.dest(defaults.cssSource))
        .pipe(browserSync.stream());
});

gulp.task(
    'serve',
    gulp.series('sass', () => {
        browserSync.init({
            server: {
                baseDir: defaults.htmlSource,
            },
        });
    }),
);

gulp.task('reload', () => {
    browserSync.reload();
});

gulp.task(
    'watch',
    gulp.parallel('serve', () => {
        gulp.watch(defaults.sassSource + '**/*.sass').on(
            'change',
            gulp.series('sass', 'reload'),
        );
        gulp.watch(defaults.htmlSource + '*.html').on(
            'change',
            gulp.series('reload'),
        );
    }),
);
