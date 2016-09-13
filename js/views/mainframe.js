var templates = require('./templates');

module.exports = Backbone.View.extend({
    
    template: templates.main,
    
    render: function(id){
        var obj = new Object();
        obj.id = id;
        this.$el.append(this.template(obj));
        return this;
    },
});
