var _list,
    init = function( list ){
        _list = list || [];
    },
    have = function( name ){
        var ii = _list.length;
        while( ii ){
            if( _list[ --ii ].test( name ) ){
                return true;
            }
        }
        return false;
    };
    init.have = have;
module.exports = init;
