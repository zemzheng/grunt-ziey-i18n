grunt-i18n
==========

### Logs
* 2014-2-19  Use npm to install artTemplate. Update Readme
             change project name to grunt-ziey-i18n
* 2013-11-22 Upload

### About
You can use Grunt-i18n to make I18N tempalte and todo update your *.po file.

Use [artTemplate](https://github.com/aui/artTemplate.git).

### Install / 安装
<pre>
 # ### with Git ###
 # cd node_modules
 # git clone https://github.com/zemzheng/grunt-i18n.git
 # cd grunt-i18n
 # npm install
</pre>

### Demo
1. Files tree
    <pre>
          Gruntfile.js
          i18n.po
          + static
          + src
              |-- demo.html
          + node_modules 
              |-- + grunt-i18n 
    </pre>
2. Files Detail:
    * Gruntfile.js
        <pre>
            module.exports = function( grunt ){        
                grunt.initConfig({
                    i18n: {
                        options : {
                            template : {
                                setting : {
                                    // setting for artTemplate
                                    // exp. openTag : "[["
                                },
                                helpers : {
                                    // helpers for artTemplate
                                    // exp. max : function(){Math.max.apply(null,arguments)}
                                }
                            }
                        },
                        gettext: {
                            action: 'gettext',
                            src: ['static/*'],
                            lang: {
                                path: 'i18n.po',
                                name: 'en_US'
                            },
                            ignores : [
                                'static/js/jquery-*.js'
                            ]
                        },
                        xgettext : {
                            action : 'xgettext',
                            src : ['src/*'],
                            lang : {
                                path : 'i18n.po',
                                name : 'en_US'
                            },
                            ignores : [
                                'src/js/jquery-*.js'
                            ]
                        }
                    }
                });
                grunt.loadNpmTasks('grunt-i18n');
                grunt.registerTask('default',  [ 'i18n' ]);
                grunt.registerTask('gettext',  [ 'i18n:gettext' ]);
                grunt.registerTask('xgettext', [ 'i18n:xgettext' ]);
            };
        </pre>
    * src/demo.html  
        <pre>
            &lt;%= _('Hello') %&gt;
            &lt;%= _('World') %&gt;
        </pre>
    * i18n.po
        <pre>
            msgid ""
            msgstr ""
            "MIME-Version: 1.0\n"
            "Content-Type: text/plain; charset=UTF-8\n"
            "Content-Transfer-Encoding: 8bit\n"
            
            msgid "Hello"
            msgstr "你好"

            msgid "Hey"
            msgstr "喂"
        </pre>


3. Run grunt-i18n
    <pre> 
        // Run xgettext && gettext 
        # grunt

        // Run xgettext only 
        // # grunt xgettext
        
        // Run gettext only 
        // # grunt gettext      
    </pre>

4. Result
    * static/demo.html  
        <pre>
            你好
            Wrold
        </pre>
    * i18n.po
        <pre>
            msgid ""
            msgstr ""
            "MIME-Version: 1.0\n"
            "Content-Type: text/plain; charset=UTF-8\n"
            "Content-Transfer-Encoding: 8bit\n"
            
            msgid "Hello"
            msgstr "你好"

            msgid "World"
            msgstr ""

            msgid "Hey"
            msgstr "喂"
        </pre>


