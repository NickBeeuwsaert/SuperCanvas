(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.SuperCanvas = factory();
    }
})(this, function(){
<% (contents+'').split('\n').forEach(function(line){ %>
    <%= line %><% }); %>
    return SuperCanvas;
});