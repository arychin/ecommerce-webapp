import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";

export const newUser =async (
    req: Request<{},{}, NewUserRequestBody>, // additional type safety
    res: Response, 
    next: NextFunction
    )=>{
        try{
            // we are customising "req" above only
            // providing type information that helps TypeScript
            // understand the structure of the request body
            const {name, email, photo, gender, _id, dob} = req.body;
            const user = await User.create({
                name, 
                email, 
                photo, 
                gender,  
                _id, 
                dob
            })
            return res.status(201).json({
                success: true,
                message: `Welcome, ${user.name}`
            })
        } catch(error){
            return res.status(400).json({
                success: false,
                message: error
            })
        }
        
    }