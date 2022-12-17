const multer=require('multer');
const XLSX = require('xlsx');
const studentSchema=require('../model/Schema')
const async=require('async');
const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'uploads')
  },
  filename:(req,file,cb)=>{
    cb(null,Date.now()+'-'+file.originalname)
  }

});

const upload=multer({storage}).single('file');

const uploadFile=async(req,res)=>{
  upload(req,res,function(err){
    if(err){
          res.json({error_code:401,err_desc:err});
          return;
    }
    if(!req.file){
        res.json({error_code:404,err_desc:"File not found!"});
        return;
    }

    const workbook = XLSX.readFile('./uploads/'+req.file.filename);
    const sheet_name_list = workbook.SheetNames;
    let jsonPagesArray = [];
    sheet_name_list.forEach(function(sheet) {
        const jsonPage = {
            name: sheet,
            content: JSON.parse(JSON.stringify(XLSX.utils.sheet_to_json(workbook.Sheets[sheet],{defval:""})))
        };
        jsonPagesArray.push(jsonPage);        
    });

    let errors='';
    const saveFile=async function(row,callback){
      let email=row.Email;
      const result=await studentSchema.find({email:email});
      if(result.length===0){
        const student=new studentSchema({
          name:row['Name of the Candidate']!==undefined?row['Name of the Candidate']:null,
          email:row.Email!==undefined?row.Email:null,
          mobile:row['Mobile No.']!==undefined?row['Mobile No.']:null,
          dob:row['Date of Birth']!==undefined?row['Date of Birth']:null,
          workExp:row['Work Experience']!==undefined?row['Work Experience']:null,
          resume:row['Resume Title']!==undefined?row['Resume Title']:null,
          currentLocation:row['Current Location']!==undefined?row['Current Location']:null,
          address:row['Postal Address']!==undefined?row['Postal Address']:null,
          currentEmployer:row['Current Employer']!==undefined?row['Current Employer']:null,
          currentDesignation:row['Current Designation']!==undefined?row['Current Designation']:null,
        })
        await student
        .save()
        .then(details=>{
          console.log(1)
        })
        .catch((err)=>{
          console.log(err);
          errors=1+" "+err;
        })
      }
    }
    for (let sheet of jsonPagesArray){
      // console.log(sheet);
      let content=sheet.content
      
        async.eachSeries(content,saveFile,function(err){
          if(err){
            console.log("Here is the error "+err);
            errors=2+" "+err;
          }
          else{
            console.log("All data uploaded succesfully");
          }
        })
    }
    if(errors==='')res.status(200).send("File uploaded")
    else res.status(500).send(errors)
  });
}

module.exports = {
  uploadFile,
};