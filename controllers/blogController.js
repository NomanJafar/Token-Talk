const Joi = require("joi");
const User = require("../models/users");
const Blog = require("../models/blogs");
const fs = require("fs");
const { BACKEND_SERVER_PATH } = require("../config");
const blogDTO = require("../dto/blog");

const mongoDBPattern = /^[0-9a-fA-F]{24}$/;
const blogController = {
    //create blog 
    async createblog(req, res, next) {
        try {

            // check body format

            const blogSchema = Joi.object({
                title: Joi.string().required(),
                author: Joi.string().regex(mongoDBPattern).required(),
                content: Joi.string().required(),
                image: Joi.string().required(),
            });


            const { error } = blogSchema.validate(req.body);

            if (error) {

                return next(error);
            }



            const { title, author, content, image } = req.body;


            try {
                // is there a user as author
                const isUser = await User.findById(author);
                if (!isUser) {
                    return next({ status: 401, message: 'User not found' });
                }
            } catch (error) {
                return next(error);
            }


            // read image as buffer 
            const buffer = Buffer.from(image.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), 'base64');


            // give Image a name





            const imageName = `${Date.now()}-${author}.png`;


            // Store Image Locally
            try {
                fs.writeFileSync(`storage/${imageName}`, buffer);
            } catch (error) {
                return next(error);
            }


            // if there is a user, create his blog
            let new_blog;
            try {
                new_blog = new Blog({ title, content, author, photopath: `${BACKEND_SERVER_PATH}/storage/${imageName}` });
                await new_blog.save();

            } catch (error) {
                return next(error);
            }
            const blogToSend = new blogDTO(new_blog);
            return res.apiSuccess({ blog: blogToSend }, 'Blog created Successfully', 201, true);

        } catch (error) {
            return next(error);
        }

    },
    // get all blogs
    async getallblogs(req, res, next) {
        try {
            // get user id
            const user_id = req.id;
            // get all the blogs that belong to that user
            if (user_id) {
                try {
                    const blogs = await Blog.find({ author: user_id });
                    res.apiSuccess({ blogs }, "Blogs fetched successfully", 200, true);

                } catch (error) {
                    next(error);
                }
            }
        } catch (error) {
            next(error);

        }


    },
    // get blog by id
    async getBlogbyid(req, res, next) {
        const blogSchema = Joi.object({
            blog_id: Joi.string().regex(mongoDBPattern).required(),
        })

        const { error } = blogSchema.validate(req.query);
        const blog_id = req.query.blog_id;
        if (error) {
            return next(error);
        }

        try {
            const blog = await Blog.findById({ _id: blog_id });
            if (blog) {
                res.apiSuccess({ blog }, "blog fetched successfully", 200, true);
            }
            else {
                res.apiSuccess({}, "Blog not found", 200, true);
            }
        } catch (error) {
            return next(error);
        }

    },
    // delete blog by id
    async deleteblogbyid(req, res, next) {
        const blogSchema = Joi.object({
            blog_id: Joi.string().regex(mongoDBPattern).required(),
        })

        const { error } = blogSchema.validate(req.query);
        if (error) {
            return next(error);
        }
        const blog_id = req.query.blog_id;

        try {
            const deletedblog = await Blog.findOneAndDelete({ _id: blog_id });
            if (deletedblog) {
                const photopath = deletedblog.photopath;
                const path = photopath.split("/").at(-1);

                fs.unlinkSync(`storage/${path}`);
                return res.apiSuccess({ deletedblog }, " blog deleted successfully", 200, true);

            }
            else {
                return res.apiSuccess({}, " blog not found", 404, true);
            }
        } catch (error) {
            return next(error);
        }

    },

    // update blog by id

    async updateblog(req, res, next) {

        const updateSchema = Joi.object({
            blog_id: Joi.string().regex(mongoDBPattern).required(),
            title: Joi.string(),
            content: Joi.string(),
            image: Joi.string()
        })

        const { error } = updateSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const { blog_id, title, content, image } = req.body;


        // get the blog that is needed to update


        let previousBlog;
        try {
            previousBlog = await Blog.findById({ _id: blog_id });

        } catch (error) {
            return next(error);
        }

        try {
            // if there is any image to update            
            if (image) {

                // read image as buffer 
                const buffer = Buffer.from(image.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), 'base64');

                // give Image a name
                imageName = `${Date.now()}-${previousBlog.author}.png`;

                // Store Image Locally
                try {
                    fs.writeFileSync(`storage/${imageName}`, buffer);
                } catch (error) {
                    return next(error);
                }

            }

            // remove previous image from storage
            const photopath = previousBlog.photopath;
            const path = photopath.split("/").at(-1);
            fs.unlinkSync(`storage/${path}`);


            const blogToUpdate = {
                ...req.body,
                blog_id: undefined,
                photopath: `${BACKEND_SERVER_PATH}/storage/${photopath}.png`
            }

            const blog = await Blog.findByIdAndUpdate(blog_id, { ...blogToUpdate });
            if (blog) {
                return res.apiSuccess({ blog }, "blog updated successfully", 200, true);
            }
            else {
                return res.apiSuccess({ blog }, "blog with this id is not found", true);
            }


        } catch (error) {
            return next(error);
        }

    }


}


module.exports = blogController;