const Joi = require("joi");
const User = require("../models/users");
const Blog = require("../models/blogs");
const fs = require("fs");
const { BACKEND_SERVER_PATH } = require("../config");

const mongoDBPattern = /^[0-9a-fA-F]{24}$/;
const blogController = {
    //create blog 
    async createblog(req, res, next){
        try {
    
     // check body format
     console.log("testlog");
     const blogSchema = Joi.object({
        title: Joi.string().required(),
      author: Joi.string().regex(mongoDBPattern).required(),
      content: Joi.string().required(),
      image: Joi.string().required(),
      });

    
      const { error } = blogSchema.validate(req.body);
     
      if(error){
       
        return next(error);
      }
     


      const {title, author, content , image} = req.body;
      
      
      try {
        // is there a user as author
        const isUser = await User.findById(author);
        if(!isUser){
            return next({status:401, message:'User not found'});
        }
    } catch (error) {
        return next(error);
      }
        
      
      // read image as buffer 
        const buffer = Buffer.from(image.replace(/^data:image\/(png|jpg|jpeg);base64,/,''), 'base64');
        
        
        // give Image a name
        

       
        
      
        const imageName =  `${Date.now()}-${author}.png`;
      
      
        // Store Image Locally
        try {
            fs.writeFileSync(`storage/${imageName}`, buffer);
        } catch (error) {
            return next(error);
        }
      
      
        // if there is a user, create his blog
        try {
            const new_blog = new Blog({title, content, author, photopath: `${BACKEND_SERVER_PATH}/storage/${imageName}`});
            await new_blog.save();
           
        } catch (error) {
            return next(error);
        }

        return res.apiSuccess({}, 'Blog created Successfully', 201, true );

    } catch (error) {
            console.log("last",error);
            return next(error);
    }

    }
    // get all blogs
    // get blog by id
    // delete blog by id
    // update blog by id

}


module.exports = blogController;