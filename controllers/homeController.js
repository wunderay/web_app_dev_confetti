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

module.exports = {
    index: (req, res) => {
        res.render("index");
    }
 }