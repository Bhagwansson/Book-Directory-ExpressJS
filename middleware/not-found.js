const notFound = (req, res) => {
    res.status(404).json({msg : "Requested page not found"});
}



module.exports = notFound;