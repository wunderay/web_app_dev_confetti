"use strict";

const Course = require("../models/course"),
httpStatus = require("http-status-codes"),
User = require("../models/user");

module.exports = {
    index: (req, res, next) => {
        Course.find()
        .then(courses => {
            res.locals.courses = courses;
            next();
        })
        .catch(error => {
            console.log(`Error fetching course data: ${error.message}`);
            next(error);
        })
    },
    indexView: (req, res) => {
        res.render("courses/index");
    },
    new: (req, res) => {
        res.render("courses/new");
    },
    create: (req, res, next) => {
        let newcourse = new Course({
            title: req.body.title,
            description: req.body.description,
            maxStudent: req.body.maxStudent,
            cost: req.body.cost
        });
        Course.create(newcourse)
        .then( course => {
            res.locals.course = course;
            res.locals.redirect = "/courses";
            next();
        })
        .catch(error => {
            console.log(`Error saving: ${error.message}`);
            next(error);
        })
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if(redirectPath != undefined) res.redirect(redirectPath);
        else next();
    },
    show: (req, res, next) => {
        let courseId = req.params.id;
        Course.findById(courseId)
        .then(course => {
            res.locals.course = course;
            next();
        })
        .catch(error => {
            console.log(`Error fetching course by ID: ${error.message}`);
        })
    },
    showView: (req, res) =>{
        res.render("courses/show");
    },
    edit: (req, res, next) => {
        let courseId = req.params.id;
        Course.findById(courseId)
        .then(course => {
            res.render("courses/edit", {course: course});
        })
        .catch(error => {
            console.log(`Error fetching course by ID: ${error.message}`);
            next(error);
        })
    },
    update: (req, res, next) => {
        let courseId = req.params.id;
        let updatedcourse = new Course({
            title: req.body.title,
            description: req.body.description,
            maxStudent: req.body.maxStudent,
            cost: req.body.cost
        });
        Course.findByIdAndUpdate(courseId, updatedcourse)
        .then(course => {
            res.locals.course = course;
            res.locals.redirect = `courses/${course._id}`;
            next();
        })
        .catch(error => {
            console.log(`Error fetching course by ID: ${error.message}`);
            next(error);
        })
    },
    delete: (req, res, next) => {
        let courseId = req.params.id;
        Course.findByIdAndRemove(courseId)
        .then(() => {
            res.locals.redirect = "courses";
            next();
        })
        .catch(error => {
            console.log(`Error fetching course by ID: ${error.message}`);
            next(error);
        })
    },
    respondJSON: (req, res) => {
        res.json({
            status: httpStatus.OK,
            data: res.locals
        });
    },
    errorJSON: (error, req, res, next) => {
        let errorObject;
        if(error) {
            errorObject = {
                status: httpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            };
        } else {
            erroObject = {
                status: httpStatus.OK,
                message: "Unknown Error."
            };
        }
        res.json(errorObject);
    },
    filterUserCourses: (req, res, next) => {
        let currentUser = res.locals.currentUser;
        if (currentUser) {
            let mappedCourses = res.locals.courses.map((course) => {
                let userJoined = currentUser.courses.some((userCourse) => {
                    return userCourse.equals(course._id);
                });
                return Object.assign(course.toObject(), {joined: userJoined});
            });
            res.locals.courses = mappedCourses;
            next();
        } else {
            next();
        }
    },
    join: (req, res, next) => {
        let courseId = req.params.id,
        currentUser = req.user;
        if(currentUser) {
            User.findByIdAndUpdate(currentUser, {
                $addToSet: {
                    courses: courseId
                }
            })
            .then(() => {
                res.locals.success = true;
                next();
            })
            .catch(error => {
                next(error);
            });
        } else { 
            next(new Error("User must log in."));
        }
    }
}
