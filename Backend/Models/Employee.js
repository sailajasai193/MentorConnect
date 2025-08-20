const mongoose=require('mongoose')

const EmployeeSchema = new mongoose.Schema({
    name: String,
    email: {
      type:String,
      unique:true,
    },
    password: String
});


const Employeemodel = mongoose.model('employees', EmployeeSchema);
module.exports=Employeemodel