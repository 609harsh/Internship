import React from 'react'
import './fileupload.css'
import { useState } from 'react'
import axios from 'axios';


function Fileupload() {
  const [file, setFile] = useState(null)
  const [status,setStatus]=useState(0);
  const onInputChange=(e)=>{
    setFile(e.target.files[0]);
  }

  const onFileSubmit=(e)=>{
    e.preventDefault();
    if(file===null){
      setStatus(3);
      return;
    }
    const data=new FormData();
    data.append('file',file)
    
    axios.post('http://localhost:5000/api/uploads',data)
    .then(function (response) {
      console.log(response);
      setStatus(1);
    })
    .catch(function (error) {
      console.log(error);
      setStatus(2);
    });

  }
  return (
      <form method="post"  id="#" onSubmit={onFileSubmit}> 
        <div className="form-group files">
          <h2>Upload Your File </h2>
          
            <input type="file" onChange={onInputChange} className="form-control" multiple="" />
            <h4>or Drag it here</h4>
          
          
          {
            status===1?
            <h3 style={{color:'green'}}>File uploaded successfully</h3>:
            (status===2?<h3 style={{color:'red'}}>Please Try again</h3>:
            (status===3?<h3>Please Select File</h3>:''))
          }
        </div>
        <button>Submit</button>
      </form>     
  )
}

export default Fileupload