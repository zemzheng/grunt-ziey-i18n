require('../libs/string.js');
var path     = require('path'),
    gettext  = require('../libs/gettext.js'),
    ignores  = require('../libs/ignores.js'),
    extend   = require('../libs/extend.js'),
    template = require('art-template');


module.exports = function(grunt) {

    var xgettext = function(str) {
        var outstr = gettext._(str);
        xgettext.dict[str] = outstr === str ? '' : outstr;
    }
    xgettext.init = function(obj) {
        xgettext.dict = obj || {};
    }

    var setTemplate = function( options ){
        var key, setting, helpers;

        if( setting = options.setting ){
            for( key in setting ){
                template[ key ] = setting[ key ];
            }
        }
        if( helpers = options.helpers ){
            grunt.log.warn( "[WARN] It's better not to use helpers in i18n template" );
            for( key in helpers ){
                template.helper( key, helpers[ key ] );
            }
        }
    };

    // 默认不转义
    template.isEscape = false;

    // 默认错误输出
    template.onerror = function( e ){
        var result = e.name + ' -> ' + e.message + ' @' + e.id;
        if( undefined !== e.line ) result += ':' + e.line;
        grunt.log.error( '[Error]', result );
        throw e;
    };

    grunt.registerMultiTask('i18n', 'I18n tools', function() {
        var inputOptions = this.options(),
            options = extend( {}, inputOptions, this.data );

        ignores( options.ignores );
        setTemplate( options.template );

        var po_file = path.join( process.cwd(), options.lang.path );
        gettext.clear();

        if( !grunt.file.isFile( po_file ) ){
            return grunt.log.error(
                '[Error] 404 : [%s] %s'.sprintf( options.lang.name, po_file )
            );
        }
        gettext.handlePoTxt(
            options.lang.name,
            grunt.file.read(po_file)
        );
        gettext.setLang( options.lang.name);

        grunt.log.ok(
            'Load : [%s] %s'.sprintf( options.lang.name, po_file )
        );

        grunt.log.writeln( "Let's start ".bold );
        grunt.log.writeln('===============================');

        xgettext.init();
        this.filesSrc.forEach(function( src ) {
            
            if ( ignores.have( src ) || !grunt.file.isFile( src ) ) return;

            grunt.log.writeln( '[Target] %s'.sprintf( src ) );
            grunt.log.write( '  ' );

            var text = grunt.file.read(src);
            grunt.log.write( '[Read] '.green );

            template.helper('_', xgettext);
            ( template.compile( src, text ) )(0);
            grunt.log.write( '[Record] '.green );

            template.helper('_', gettext._);
            text = ( template.compile( src, text) )(0);
            grunt.log.write( '[Translate] '.green );

            grunt.file.write(src, text);
            grunt.log.write( '[Update] '.green  );

            grunt.log.ok('    ... Done');

        });
        var poObj = gettext.getDictByLang( this.data.lang.name ),
            poTxt;
        for( msgid in poObj ){
            if( !xgettext.dict[ msgid ] ){                    
                xgettext.dict[ msgid ] = poObj[ msgid ];
            }
        }
        poTxt = gettext.obj2po( xgettext.dict );

        grunt.log.writeln('===============================');
        grunt.file.write( po_file, poTxt );
        grunt.log.writeln( '%s update'.sprintf( po_file )  );
    });
}
