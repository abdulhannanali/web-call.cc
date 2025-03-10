const { Transform } = require('stream')
const path = require('path')

const gulp = require('gulp')
const stylus = require('gulp-stylus')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const include = require('gulp-include')
const glob = require('glob')
const rimraf = require('rimraf')
const webpackStream = require('webpack-stream')
const mergeStream = require('merge-stream')
const GulpUglify = require('gulp-uglify')
const sourcemaps = require('gulp-sourcemaps')
const fs = require('fs')
const GulpCleanCss = require('gulp-clean-css')



const BUILD_DIRECTORY = path.join(__dirname, 'build')
const SOURCE_DIRECTORY = path.join(__dirname, 'source')

function clean (cb) {
    rimraf(BUILD_DIRECTORY, function () {
        cb()
    })
}

function bufferGulpIncludeContents () {
    return new Transform({
        readableObjectMode: true,
        writableObjectMode: true,
        transform: (chunk, enc, callback) => {
            callback(null, chunk)
        }
    })
}

function getGulpIncludeStream () {
    return include({ 
        includePaths: [
            path.join(__dirname, 'node_modules'),
            path.join(__dirname, 'node_modules', '@vaadin'),
            path.join(__dirname, 'node_modules', '@polymer'),
            path.join(SOURCE_DIRECTORY, 'javascripts')
        ],
        extensions: 'js',
        hardFail: true,
        separateInputs: true,
    })
}

function resolveSrcGlob (...globs) {
    return gulp.src(globs, { cwd: SOURCE_DIRECTORY, base: SOURCE_DIRECTORY })
}


const webpackEnabledFiles = [
    'finder-vaadin-polymer.js',
]

function stylusTask () {    
    return resolveSrcGlob('**/*.styl')
        .pipe(sourcemaps.init())
        .pipe(stylus())
        .pipe(GulpCleanCss())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(BUILD_DIRECTORY))
}

function postCssTask () {
    return resolveSrcGlob('**/*.css')
        .pipe(postcss([autoprefixer()], { }))
        .pipe(GulpCleanCss())
        .pipe(gulp.dest(BUILD_DIRECTORY))
}


async function images () {
    const imagemin = await import('gulp-imagemin')
    
    return resolveSrcGlob('**/*.+(png|jpeg|jpg|svg)')
        .pipe(imagemin.default())
        .pipe(gulp.dest(BUILD_DIRECTORY))
}

function copySourceDirectory() {
    return resolveSrcGlob("**/*").pipe(gulp.dest(BUILD_DIRECTORY))
}

function copyRobots () {
    return gulp.src('./robots.txt').pipe(gulp.dest(BUILD_DIRECTORY))
}


function bundleNonWebpackJS () {
    return resolveSrcGlob('**/*.js')
    .pipe(getGulpIncludeStream())
    .pipe(sourcemaps.init())
    .pipe(GulpUglify())
    .pipe(sourcemaps.write('.'))
    .pipe(bufferGulpIncludeContents())
    .pipe(gulp.dest(BUILD_DIRECTORY, { overwrite: true }))
}

function bundleWebpackJS () {
    const stream = mergeStream()

    glob(path.join(SOURCE_DIRECTORY, `**/+(${webpackEnabledFiles.join('|')}|*.module.js)`), function (error, files) {
        if (error) {
            throw error;
        }
        
        for (const input of files) {
            const inputParsedPath = path.parse(input)
            const inputFileName = inputParsedPath.name + inputParsedPath.ext
            const finalPath = path.join(BUILD_DIRECTORY, 'javascripts', inputFileName)
            const finalParsedPath = path.parse(finalPath)

            if (fs.existsSync(finalPath)) {
                fs.unlinkSync(finalPath)
            } 

            const wbp = gulp.src(input)
                .pipe(getGulpIncludeStream())
                .pipe(bufferGulpIncludeContents())
                .pipe(gulp.dest(finalParsedPath.dir))
                .pipe(webpackStream({
                    target: 'web',
                    mode: 'production',

                    output: {
                        filename: finalParsedPath.name + finalParsedPath.ext,
                        path: '/'
                    },
                    
                    module: {
                        rules: [
                          {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                              loader: 'babel-loader',
                              options: {
                                presets: ['@babel/preset-env']
                              }
                            }
                          },
                        ],
                      },
                      
                      optimization: {
                          sideEffects: false,
                      }
                }))
                .pipe(gulp.dest(finalParsedPath.dir))

            stream.add(wbp)
        }
    })

    return stream
}

const bundleJS = gulp.series(
    bundleNonWebpackJS,
    bundleWebpackJS,
)

const styles = gulp.parallel(
    stylusTask,
    postCssTask
)

const copy = gulp.parallel(
    copyRobots,
    copySourceDirectory
)

exports.clean = clean
exports.bundleJS = bundleJS
exports.images = images
exports.copy = copy
exports.bundle = gulp.series(
    clean,
    copy,
    gulp.parallel(
        bundleJS,
        styles,
        images,
    )
)
