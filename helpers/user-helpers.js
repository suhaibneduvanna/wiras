var db = require('../config/connection')
var collection = require('../config/collections')
const bycrypt = require('bcrypt') 
var objectId = require('mongodb').ObjectID 
const { use } = require('../routes/users')
const productHelpers = require('./product-helpers')
module.exports={
    signUpFunction:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.Password= await bycrypt.hash(userData.Password,10)
            
            db.get().collection(collection.USER_COLLECTIONS).insertOne(userData).then((data)=>{
                resolve(data.ops[0])
            })

        })
        
    },

    loginFunction:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            
            let response={}
            let user= await db.get().collection(collection.USER_COLLECTIONS).findOne({Email:userData.Email})
            
            if(user){
                bycrypt.compare(userData.Password,user.Password).then((status)=>{
                    
                    if(status){
                        
                        response.user=user
                        response.status=true
                        resolve(response)
                    } else{
                        console.log ('login failed')
                        resolve({status:false})
                    }
                })
            } else {
                console.log('login failed ')
                resolve({status:false})
            }

        })
    },

    addtoCart:(productId,userId)=>{
        let productObject={
            item:objectId(productId),
            quantity:1
        }
        return new Promise(async(resolve,reject)=>{
            let userCart= await db.get().collection(collection.CART_COLLECTIONS).findOne({user:objectId(userId)})
            if(userCart){
                let productExist=userCart.products.findIndex(product=> product.item==productId)
                console.log(productExist)
                if(productExist!=-1){
                    db.get().collection(collection.CART_COLLECTIONS)
                    .updateOne({'products.item':objectId(productId)},
                        {
                            $inc:{'products.$.quantity':1}

                        }).then(()=>{
                            resolve()
                        })
                        
                        
                } else{
                    db.get().collection(collection.CART_COLLECTIONS).updateOne({user:objectId(userId)},{
                    
                        $push:{products:productObject}
                          
                       }).then((response)=>{
                           resolve()
                       })
                }
                

            } else{
                let cartObjects={
                    user:objectId(userId),
                    products:[productObject]
                }

                db.get().collection(collection.CART_COLLECTIONS).insertOne(cartObjects).then((response)=>{
                    resolve()
                })
            }
        })
    }, 

    getCartProducts:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cartItems= await db.get().collection(collection.CART_COLLECTIONS).aggregate([
                {
                    $match:{user:objectId(userId)}
                },
                // {
                //     $lookup:{
                //         from:collection.PRODUCT_COLLECTIONS,
                //         let:{productList:'$products'},
                //         pipeline:[{
                //             $match:{
                //                 $expr:{
                //                     $in:['$_id','$$productList']
                //                 }
                //             }
                //         }],
                //         as:'cartItems'
                //     }
                // }
            ]).toArray()
            resolve(cartItems[0].cartItems)
        })
    },

    cartCount:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cart=await db.get().collection(collection.CART_COLLECTIONS).findOne({user:objectId(userId)})
            let cartcount=0
            if(cart){
                cartcount=cart.products.length
            }
            resolve(cartcount)
        })
    }
}