const MongoClient = require('mongodb').MongoClient

const state= {
    db:null
}

module.exports.connect=function(done){
    const url = 'mongodb+srv://suhaibn:suhaibn@2000@cluster0.9hjmk.mongodb.net/<wiras>?retryWrites=true&w=majority'
    const dbname = "wiras"

    MongoClient.connect(url,(err,data)=>{
        if(err){
        return done(err) }
        else{
        state.db=data.db(dbname)}
        done()
    })

    
}

module.exports.get=function(){
    return state.db
}