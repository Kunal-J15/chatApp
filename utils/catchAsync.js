module.exports = function (fn) {
    return function (req,res,next) {
        fn(req,res,next).catch(e=>{console.log(e); return res.status(500).json({msg:"internal server error unhabled error"})})
    }
    
}