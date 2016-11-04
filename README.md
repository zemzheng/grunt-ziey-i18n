grunt-ziey-i18n
==========

### Logs
* 2014-05-21 Update, you can set more than one language now, enjoy it.
* 2014-02-19 Use npm to install artTemplate. Update Readme
             change project name to grunt-ziey-i18n
* 2013-11-22 Upload

### About
You can use Grunt-ziey-i18n to make I18N tempalte and todo update your *.po file.

Use [artTemplate](https://github.com/aui/artTemplate.git).

### Install / 安装
<pre>
 # ### with Git ###
 # cd node_modules
 # git clone https://github.com/zemzheng/grunt-ziey-i18n.git
 # cd grunt-ziey-i18n
 # npm install
</pre>

OR

<pre>
 # ### with npm ###
 # npm install grunt-ziey-i18n
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
              |-- + grunt-ziey-i18n 
    </pre>
2. Files Detail:
    * Gruntfile.js
        <pre>
            module.exports = function( grunt ){        
                grunt.initConfig({

                    i18n: {
                        zh_CN: {
                            src: [ '../online/static/zh_CN/**' ],
                            lang: { path: 'lang/zh_CN.po', name: 'zh_CN' }
                        },
                        en_US: {
                            src: [ '../online/static/en_US/**' ],
                            lang: { path: 'lang/en_US.po', name: 'en_US' }
                        },
                        options: {
                            template: {
                                setting: {
                                    openTag  : '<%',
                                    closeTag : '%>',
                                    isEscape : false, // 是否转义 html， 默认忽略
                                },
                                helpers : { // 不建议使用
                                    <func_name> : function(){ ... } // 辅助方法
                                },
                            },
                            ignores: [
                                /jquery[^\.].js/i,
                                /template.js/,
                                /bootstrap/i,
                                /select2\./,
                                /pnotify/,
                                /img\//,
                                /css\//
                            ] 
                        }
                    }
                });
                grunt.loadNpmTasks('grunt-ziey-i18n');
                grunt.registerTask('default',  [ 'i18n' ]);
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


3. Run grunt-ziey-i18n
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


