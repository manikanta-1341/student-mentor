const {MongoClient} = require('mongodb')

module.exports = {
    db:{},
    async connect (){
        try{
            const client = await MongoClient.connect("mongodb+srv://admin:admin@cluster0.igxh2.mongodb.net/student-mentor?retryWrites=true&w=majority") ;
            this.db = client.db("student-mentor");
            console.log("db::::",this.db)
        }
        catch(err){
            console.log(err)

        }
    }
}