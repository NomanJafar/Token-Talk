class blogDTO{
    constructor(blog){
        this._id = blog._id;
        this.title = blog.title;
        this.content = blog.content;
        this.photopath = blog.photopath
        this.author = blog.author
    }
}

module.exports = blogDTO;