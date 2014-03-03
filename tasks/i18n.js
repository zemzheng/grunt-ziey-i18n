var path     = require('path'),
    gettext  = require('../libs/gettext.js'),
    template = require('art-template');

// -------- gettext ---------
gettext._.format = function(str, array) {
    return gettext._(str).replace(/%s/g, function() {
        return array.shift();
    });
};
// -------- /gettext ---------

// -------- xgettext ---------
var xgettext = function(str) {
    var outstr = gettext._(str);
    xgettext.dict[str] = outstr === str ? '' : outstr;
}
xgettext.init = function(obj) {
    xgettext.dict = obj || {};
}
xgettext.format = xgettext;
// -------- /xgettext ---------

module.exports = function(grunt) {

    grunt.registerMultiTask('i18n', 'I18n tools', function() {

        var action = this.data.action;
        if( !action ) return;

        var po_file = path.join(process.cwd(), this.data.lang.path);
        gettext.clear();

        // ignore list
        var ignores = this.data.ignores,
            isInIgnoresList = function( name ){
            var ii = ignores.length;
            while( ii ){
                if( ignores[ --ii ].test( name ) ){
                    return true;
                }
            }
            return false;
        }

        // load po file if exists
        grunt.log.writeln( 'Load po file : ' );
        if( grunt.file.isFile( po_file ) ){
            gettext.handlePoTxt(
                this.data.lang.name,
                grunt.file.read(po_file)
            );
            gettext.setLang(this.data.lang.name);

            grunt.log.ok(
                'Loaded Success : [' + this.data.lang.name + ']' + po_file
            );
        } else {
            return grunt.log.error(
                'Loaded Failure : [' + this.data.lang.name + ']' + po_file
            );
        }

        template.onerror = function( e ){
            grunt.log.error( e.name, e.message );
            throw e;
        };
        // 按照设置配置 template 
        (function( template, options ){
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
        })( template, this.options().template );

        switch( action ){
            case 'gettext': 
                grunt.log.writeln('i18n:gettext:Translate output...');
                template.helper('_', gettext._);
                break;
            case 'xgettext':
                grunt.log.writeln('i18n:xgettext:Pick up lang...');
                xgettext.init();
                template.helper('_', xgettext);
                break;
            default:
                grunt.log.error('i18n : unknow[' + action + '] : Exit');
                return;
        }
        grunt.log.writeln( '===============================' );
        grunt.log.writeln( '[T] = Translate' );
        grunt.log.writeln( '[W] = Write' );
        grunt.log.writeln( '===============================' );
        this.filesSrc.forEach(function(src) {
            if ( !grunt.file.isFile( src ) || isInIgnoresList( src ) ) return;

            grunt.log.writeln('[T] ' + src);

            var text = grunt.file.read(src);
            text = ( template.compile(text) )(0);

            if( 'gettext' === action ){
                grunt.log.writeln( '[W] ' +  src );
                grunt.file.write(src, text);
            }

            grunt.log.ok('    ... Done');

        });

        if( 'xgettext' === action ){
            var poObj = gettext.getDictByLang( this.data.lang.name ),
                poTxt;

            for( msgid in poObj ){
                if( !xgettext.dict[ msgid ] ){                    
                    xgettext.dict[ msgid ] = poObj[ msgid ];
                }
            }

            poTxt = gettext.obj2po( xgettext.dict );

            grunt.file.write( po_file, poTxt );
        }
    });
}
