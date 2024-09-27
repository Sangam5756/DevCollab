


export const authUser = (req,res,next)=>{
    console.log("checking user auth")
    const token = "secret";
    const isAuth = token === "secret";
    if(!isAuth){
        res.send("User is Unauthorized")
    }else{
        next()
    }
}