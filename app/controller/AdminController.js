
class AdminController{

    async home(req,res){
        try{
            res.render('home',{title:'Home Page',name:'Aman'})
        }catch(err){
            console.log(err)
        }
    }
    
}

module.exports=new AdminController();