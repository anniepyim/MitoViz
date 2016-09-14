var templates = require('./templates');

module.exports = Backbone.View.extend({
    
    template: templates.main,
    
    pca: templates.pca,
    
    pcabarchart: templates.pcabarchart,
    
    scplot: templates.scplot,
    
    render: function(id){
        var obj = new Object();
        obj.id = id;
        this.$el.append(this.template(obj));
        return this;
    },
    
    renderpca: function(){
        this.$el.append(this.pca());
        return this;
    },
    
    renderpcabc: function(){
        this.$el.append(this.pcabarchart());
        return this;
    },
    
    renderscplot: function(id){
        this.$el.append(this.scplot());
        return this;
    },
});
