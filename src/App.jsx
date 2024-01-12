import { Button, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import FileBase64 from "react-file-base64";

const App = () => {
    let API = "http://localhost:3000/data"
    let [todos, setTodos] = useState([])
    function handleImg(file) {
        setImgBase64(file.base64)
    }

    /// add
    let [inpAdd, setInpAdd] = useState("")
    let [imgBase64, setImgBase64] = useState(null)

    //edit
    let [dialogEdit, setDialogEdit] = useState(false)
    let [inpEdit, setInpEdit] = useState("")
    let [imgEditBase64, setImgEditBase64] = useState(null)
    let [idx, setIdx] = useState(null)
    

    /// get
    async function get() {
        try {
            let { data } = await axios.get(API)
            setTodos(data)
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        get()
    }, [])


    /// add
    async function addUser() {
        try {
            let { data } = await axios.post(API, {
                id : Date.now(),
                name : inpAdd,
                img : imgBase64
            })
            get()
            setInpAdd("")
            setImgBase64(null)
        } catch (error) {
            console.log(error);
        }
    }

    /// delete
    async function deleteUser(id) {
        try {
            let { data } = await axios.delete(`${API}/${id}`)
            get()
        } catch (error) {
            console.log(error);
        }
    }

    /// edit
    function handleEditImg(file) {
        setImgEditBase64(file.base64)
    }
    function editShow(user) {
        setDialogEdit(true)
        setIdx(user.id)
        setInpEdit(user.name)
        setImgEditBase64(user.img)
    }
    async function editUser() {
        try {
            let { data } = await axios.put(`${API}/${idx}`, {
                id : idx,
                name : inpEdit, 
                img : imgEditBase64
            })
            get()
        } catch (error) {
            console.log(error);
        }
        setDialogEdit(false)
    }

  return (
    <>
      <div className="flex m-[20px] gap-[30px] items-center">
        <FileBase64 multiple={false} onDone={handleImg} />
        <TextField label="name" value={inpAdd} onChange={(event) => setInpAdd(event.target.value)} />
        <Button variant="contained" onClick={addUser} >Add</Button>
      </div>
      {
        todos.map((elem) => {
            return (
                <div className="p-[20px] m-[20px] bg-slate-100 border-2 " key={elem.id}>
                    <h1 className="text-[25px] font-[600]">{elem.name}</h1>
                    <img src={elem.img} alt="" className="w-[150px] rounded-[50%] h-[150px]" />
                    <Button variant="outlined" onClick={() => editShow(elem)}>Edit</Button>
                    <Button variant="contained" color="error" onClick={() => deleteUser(elem.id)} sx={{marginLeft:"20px"}}>Delete</Button>
                </div>
            )
        })
      }
      {dialogEdit ? <div className="w-[400px] p-[30px] border-[1px] bg-gray-100 rounded-[10px] border-black absolute top-[200px] left-[600px]">
        <TextField value={inpEdit} onChange={(event) => setInpEdit(event.target.value)} />
        <img src={imgEditBase64} alt="" className="w-[150px] h-[150px] rounded-[50%]" />
        <FileBase64 multiple={false}  onDone={handleEditImg} />
        <Button variant="contained" onClick={editUser} sx={{margin:"20px"}}>Edit</Button>
      </div> : null}
    </>
  );
};

export default App;
