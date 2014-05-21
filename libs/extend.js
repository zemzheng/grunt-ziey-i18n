var extendSingle = function( obj0, obj1 ){
        var key;
        for( key in obj1 ){
            obj0[ key ] = obj1[ key ];
        }
        return obj0;
    },
    extend = function(){
        var result = {};
        Array.prototype.forEach.call( 
            arguments,
            function( obj, index, args ){
                extendSingle( result, obj );
            }
        );
        return result;
    }
module.exports = extend;
