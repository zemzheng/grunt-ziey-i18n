require('../libs/string.js');
var path     = require('path'),
    gettext  = require('../libs/gettext.js'),
    ignores  = require('../libs/ignores.js'),
    extend   = require('../libs/extend.js'),
    template = require('art-template');


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
        for( key in helpers ){
            template.helper( key, helpers[ key ] );
        }
    }
};
var _options = {
    template : {
        onerror : function( e ){
            grunt.log.error( e.name, e.message );
            throw e;
        }
    }
}

module.exports = function(grunt) {
    grunt.registerMultiTask('i18n', 'I18n tools', function() {
        var options = extend(
            _options, 
            this.options(),
            this.data
        );

        ignores( options.ignores );
        setTemplate( options.template );

        var po_file = path.join( process.cwd(), options.lang.path );
        gettext.clear();

        if( !grunt.file.isFile( po_file ) ){
            return grunt.log.error(
                'Error404 : [%s] %s'.sprintf( options.lang.name, po_file )
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
            ( template.compile(text) )(0);
            grunt.log.write( '[Record] '.green );

            template.helper('_', gettext._);
            text = ( template.compile(text) )(0);
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
