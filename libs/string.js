String.prototype.sprintf = 
String.prototype.format = function(){
    var arr = Array.prototype.slice.call( arguments, 0 ),
        i = 1,
        ii = arr.length,
        s = this;

    s = s.replace( /%s/g, function(){
        return '{%' + i++ + '%}';
    });

    i = 0;
    while( i < ii ){
        s = s.replace( 
            new RegExp( '{%' + (i+1) + '%}', 'g' ),
            arr[ i++ ] 
        );
    }
    return s;
}
