'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var changed = require('gulp-changed');
var marko_ax5 = require('gulp-marko-ax5');
var notify = require("gulp-notify");
var spawn = require('child_process').spawn;

var PATHS = {
    assets: {
        src: "src/ax5docs/assets"
    },
    ax5docs: {
        css_src: "src/ax5docs/assets/css",
        css_dest: "src/ax5docs/assets/css",
        ax5core: "src/ax5docs/assets/lib/ax5core",
        doc_src: "src/ax5docs/_src_",
        doc_dest: "src/ax5docs"
    },
    ax5core: {
        root: "src/ax5core",
        src: "src/ax5core/src",
        dest: "src/ax5core/dist",
        doc_src: "src/ax5docs/_src_ax5core",
        doc_dest: "src/ax5docs/ax5core"
    },
    "bootstrap-ax5dialog": {
        root: "src/bootstrap-ax5dialog",
        src: "src/bootstrap-ax5dialog/src",
        dest: "src/bootstrap-ax5dialog/dist",
        doc_src: "src/ax5docs/_src_bootstrap-ax5dialog",
        doc_dest: "src/ax5docs/bootstrap-ax5dialog"
    },
    "bootstrap-ax5mask": {
        root: "src/bootstrap-ax5mask",
        src: "src/bootstrap-ax5mask/src",
        dest: "src/bootstrap-ax5mask/dist",
        doc_src: "src/ax5docs/_src_bootstrap-ax5mask",
        doc_dest: "src/ax5docs/bootstrap-ax5mask"
    }
};

/**
 * SASS
 */
function errorAlert(err) {
    notify("SASS Error check your terminal"); //Error Notification
    this.emit("end"); //End function
}

gulp.task('SASS', function () {
    gulp.src(PATHS.ax5docs.css_src + '/docs.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .on("error", errorAlert)
        .pipe(gulp.dest(PATHS.ax5docs.css_dest));

    gulp.src(PATHS['bootstrap-ax5mask'].src + '/ax5mask.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest(PATHS['bootstrap-ax5mask'].dest))
        .on("error", errorAlert)
        .pipe(gulp.dest(PATHS.assets.src + '/lib/bootstrap-ax5mask'));

    gulp.src(PATHS['bootstrap-ax5dialog'].src + '/ax5dialog.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest(PATHS['bootstrap-ax5dialog'].dest))
        .on("error", errorAlert)
        .pipe(gulp.dest(PATHS.assets.src + '/lib/bootstrap-ax5dialog'));
});

/**
 * for JS
 */
gulp.task('AX5CORE-scripts', function () {
    gulp.src(PATHS.ax5core.src + '/*.js')
        .pipe(concat('ax5core.js'))
        .pipe(gulp.dest(PATHS.ax5core.dest))
        .pipe(gulp.dest(PATHS.assets.src + '/lib/ax5core'))
        .pipe(concat('ax5core.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(PATHS.ax5core.dest))
        .pipe(gulp.dest(PATHS.assets.src + '/lib/ax5core'));
});

gulp.task('AX5MASK-scripts', function () {
    gulp.src(PATHS["bootstrap-ax5mask"].src + '/*.js')
        .pipe(concat('ax5mask.js'))
        .pipe(gulp.dest(PATHS["bootstrap-ax5mask"].dest))
        .pipe(gulp.dest(PATHS.assets.src + '/lib/bootstrap-ax5mask'))
        .pipe(concat('ax5mask.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(PATHS["bootstrap-ax5mask"].dest))
        .pipe(gulp.dest(PATHS.assets.src + '/lib/bootstrap-ax5mask'));
});

gulp.task('AX5DIALOG-scripts', function () {
    gulp.src(PATHS["bootstrap-ax5dialog"].src + '/*.js')
        .pipe(concat('ax5dialog.js'))
        .pipe(gulp.dest(PATHS["bootstrap-ax5dialog"].dest))
        .pipe(gulp.dest(PATHS.assets.src + '/lib/bootstrap-ax5dialog'))
        .pipe(concat('ax5dialog.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(PATHS["bootstrap-ax5dialog"].dest))
        .pipe(gulp.dest(PATHS.assets.src + '/lib/bootstrap-ax5dialog'));
});

/**
 * ax5docs templete render
 */
gulp.task('AX5UI-docs', function () {
    return gulp.src(PATHS['ax5docs'].doc_src + '/**/*.html')
        .pipe(changed(PATHS['ax5docs'].doc_dest, {extension: '.html', hasChanged: changed.compareSha1Digest}))
        .pipe(marko_ax5({
            projectName: "ax5ui",
            layoutPath: PATHS.assets.src + '/_layouts/root.marko'
        }))
        .pipe(gulp.dest(PATHS['ax5docs'].doc_dest));
});

gulp.task('AX5CORE-docs', function () {
    return gulp.src(PATHS.ax5core.doc_src + '/**/*.html')
        .pipe(changed(PATHS.ax5core.doc_dest, {extension: '.html', hasChanged: changed.compareSha1Digest}))
        .pipe(marko_ax5({
            projectName: "ax5core",
            layoutPath: PATHS.assets.src + '/_layouts/index.marko'
        }))
        .pipe(gulp.dest(PATHS.ax5core.doc_dest));
});

gulp.task('AX5MASK-docs', function () {
    return gulp.src(PATHS['bootstrap-ax5mask'].doc_src + '/**/*.html')
        .pipe(changed(PATHS['bootstrap-ax5mask'].doc_dest, {extension: '.html', hasChanged: changed.compareSha1Digest}))
        .pipe(marko_ax5({
            projectName: "bootstrap-ax5mask",
            layoutPath: PATHS.assets.src + '/_layouts/index.marko'
        }))
        .pipe(gulp.dest(PATHS['bootstrap-ax5mask'].doc_dest));
});

gulp.task('AX5DIALOG-docs', function () {
    return gulp.src(PATHS['bootstrap-ax5dialog'].doc_src + '/**/*.html')
        .pipe(changed(PATHS['bootstrap-ax5dialog'].doc_dest, {
            extension: '.html',
            hasChanged: changed.compareSha1Digest
        }))
        .pipe(marko_ax5({
            projectName: "bootstrap-ax5dialog",
            layoutPath: PATHS.assets.src + '/_layouts/index.marko'
        }))
        .pipe(gulp.dest(PATHS['bootstrap-ax5dialog'].doc_dest));
});

gulp.task('docs:all', function () {
    gulp.src(PATHS['ax5docs'].doc_src + '/**/*.html')
        .pipe(marko_ax5({
            projectName: "ax5ui",
            layoutPath: PATHS.assets.src + '/_layouts/root.marko'
        }))
        .pipe(gulp.dest(PATHS['ax5docs'].doc_dest));

    gulp.src(PATHS.ax5core.doc_src + '/**/*.html')
        .pipe(marko_ax5({
            projectName: "ax5core",
            layoutPath: PATHS.assets.src + '/_layouts/index.marko'
        }))
        .pipe(gulp.dest(PATHS.ax5core.doc_dest));

    gulp.src(PATHS['bootstrap-ax5mask'].doc_src + '/**/*.html')
        .pipe(marko_ax5({
            projectName: "bootstrap-ax5mask",
            layoutPath: PATHS.assets.src + '/_layouts/index.marko'
        }))
        .pipe(gulp.dest(PATHS['bootstrap-ax5mask'].doc_dest));

    gulp.src(PATHS['bootstrap-ax5dialog'].doc_src + '/**/*.html')
        .pipe(marko_ax5({
            projectName: "bootstrap-ax5dialog",
            layoutPath: PATHS.assets.src + '/_layouts/index.marko'
        }))
        .pipe(gulp.dest(PATHS['bootstrap-ax5dialog'].doc_dest));
});

/**
 * watch
 */
gulp.task('watch', function () {
    gulp.watch([PATHS.ax5docs.css_src + '/**/*.scss', PATHS['bootstrap-ax5mask'].src + '/**/*.scss', PATHS['bootstrap-ax5dialog'].src + '/**/*.scss'], ['SASS']);
    gulp.watch(PATHS.ax5core.src + '/*.js', ['AX5CORE-scripts']);
    gulp.watch(PATHS["bootstrap-ax5dialog"].src + '/*.js', ['AX5DIALOG-scripts']);
    gulp.watch(PATHS["bootstrap-ax5mask"].src + '/*.js', ['AX5MASK-scripts']);

    gulp.watch(PATHS.assets.src + '/_layouts/index.marko', ['default', 'AX5CORE-docs', 'AX5MASK-docs', 'AX5DIALOG-docs']);
    gulp.watch(PATHS.assets.src + '/_layouts/root.marko', ['default', 'AX5UI-docs']);
    gulp.watch(PATHS.assets.src + '/components/**/*.js', ['default', 'AX5UI-docs', 'AX5CORE-docs', 'AX5MASK-docs', 'AX5DIALOG-docs']);

    gulp.watch(PATHS.ax5docs.doc_src + '/**/*.html', ['AX5UI-docs']);
    gulp.watch(
        [
            PATHS.ax5core.doc_src + '/**/*.html',
            PATHS['ax5core'].root + '/**/*.md'
        ],
        ['AX5CORE-docs']
    );

    gulp.watch(
        [
            PATHS['bootstrap-ax5mask'].doc_src + '/**/*.html',
            PATHS['bootstrap-ax5mask'].root + '/**/*.md'
        ],
        ['AX5MASK-docs']
    );
    gulp.watch(
        [
            PATHS['bootstrap-ax5dialog'].doc_src + '/**/*.html',
            PATHS['bootstrap-ax5dialog'].root + '/**/*.md'
        ],
        ['AX5DIALOG-docs']
    );

});

gulp.task('default', function () {
    var p;
    spawnChildren();

    function spawnChildren(e) {
        // kill previous spawned process
        if (p) {
            p.kill();
        }
        // `spawn` a child `gulp` process linked to the parent `stdio`
        p = spawn('gulp', ["watch"], {stdio: 'inherit'});
    }
});