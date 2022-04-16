const {ObjectId} = require("mongodb");
const mongo = require("../shared/connect");

module.exports.assignMentorForStudent = async (req,res,next) =>{
    try{
        console.log("req.body::",req.body)
        var data = await mongo.db.collection("mentor").insertOne(req.body);
        res.send(data);
    } 
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}