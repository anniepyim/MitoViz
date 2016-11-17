var templates = require('./templates');

module.exports = Backbone.View.extend({
    
    template: templates.main,
    
    pca: templates.pca,
    
    pcabcframe: templates.pcabcframe,
    
    scplot: templates.scplot,
    
    pcabarchart: templates.pcabarchart,
    
    pcatext: templates.pcatext,
    
    render: function(id){
        var obj = {};
        obj.id = id;
        this.$el.append(this.template(obj));
        return this;
    },
    
    renderpca: function(){
        this.$el.append(this.pca());
        return this;
    },
    
    renderpcabc: function(){
        this.$el.append(this.pcabcframe());
        return this;
    },
    
    renderscplot: function(id){
        this.$el.append(this.scplot());
        return this;
    }
});
