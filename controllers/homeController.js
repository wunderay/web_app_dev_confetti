var courses = [
    {
        title: "Raspberry Cake",
        cost: 50
    },
    {
        title: "American Burger",
        cost: 100
    },
    {
        title: "Sirloin Steak",
        cost: 500
    },
]

exports.showCourses = (req, res) => {
    res.render("courses", {offeredCourses: courses});
}

exports.showSignUp = (req, res) => {
    res.render("contact");
}

exports.postedSignUpForm = (req, res) => {
    res.render("contact");
}

exports.showIndex = (req, res) => {
    res.render("index");
}