
class HomeController{

    async home(req,res){
        try{
            res.render('home',{title:'Home Page',name:'Aman'})
        }catch(err){
            console.log(err);
            req.flash('error','Error loading home page')
        }
    }
    
}

module.exports=new HomeController();