import React, { Component } from 'react';
import axios from 'axios';
import MaterialTable from 'material-table'
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField'
import { Editor } from "@tinymce/tinymce-react";
import parse from 'html-react-parser';


import './App.css';

export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            products: [],

            _id:null,

            title:"",
            editorState:"",

            openDialog:false,
            openDialogedit:false
        }
        this.handleChange = this.handleChange.bind(this);
        this.onEditorStateChange = this.onEditorStateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
    }

    componentDidMount(){
        axios.get('http://localhost:3000/api/products')
        .then(res => {
            this.setState({ products: res.data.data});
        })
        .catch(error => {
            console.log( error);
        });
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    onEditorStateChange(editorState, editor) {
        this.setState({ editorState });
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = {
            _id:null,
            title: this.state.title,
            description: this.state.editorState,
        }

        axios.post("http://localhost:3000/api/product", data, {headers: {"Content-type": "application/json; charset=UTF-8"}})
            .then(res => {
                console.log("***", res.data.success)
                if (res.data.success === true) {
                    this.setState({
                        title: '',
                        editorState: '',
                        openDialog: false,
                    })
                    this.componentDidMount()
                }
            })
            .catch(error => {
                console.log("ee", error);
            });
    }

    handleSubmitEdit(event) {
        event.preventDefault();
        const data = {
            _id: this.state._id,
            title: this.state.title,
            description: this.state.editorState,
        }

        axios.put("http://localhost:3000/api/product/" + this.state._id, data)
            .then(res => {
                console.log("***", res.data.success)
                if (res.data.success === true) {
                    this.setState({
                        _id: null,
                        title: '',
                        editorState: '',
                        openDialogedit: false,
                    })
                    this.componentDidMount()
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    edit(id) {
        const product = this.state.products.filter(c => c["_id"] === id)
        this.setState({
            _id: product[0]._id,
            title: product[0].title,
            editorState: product[0].description,
            openDialogedit: true
        })
    }

    delete(id) {
        axios.delete("http://localhost:3000/api/product/" + id)
            .then(res => {
                console.log("***", res.data.success)
                if (res.data.success === true) {
                    this.componentDidMount()
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    render(){

        const {products, openDialog, openDialogedit, title} = this.state



        const columns = [
            {
                title: 'Title',
                render: rowData => <p>{rowData.title}</p>
            },
            {
                title: 'Description',
                render: rowData => <p>{parse(rowData.description)}</p>
            },
            {
                title: 'Edit',
                render: rowData => <button  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => { if (window.confirm('Are you sure to edit it ?')) { this.edit(rowData._id) };}}>edit</button>
            },
            {
                title: 'Delete',
                render: rowData => <button  className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => { if (window.confirm('Are you sure to delete it ?')) { this.delete(rowData._id) };}}>delete</button>
            }
        ]

        return (
            <div className="flex justify-center	bg-gray-100">
                <div class="w-5/6  h-screen">          
                        <h2 className="text-center pt-20 text-4xl">Mini test product's CRUD</h2>

                        <div className="pt-8 text-right">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => { this.setState({ openDialog: true }) }}>Add product</button>
                        </div>                       

                        <div className="pt-8">
                            <MaterialTable 
                                columns={columns}
                                data={products}
                                title="Products"
                            />
                        </div>

                        <Dialog
                            onClose={() => this.setState({ openDialog: false })}
                            aria-labelledby="simple-dialog-title"
                            open={openDialog}
                            maxWidth="md"
                            fullWidth={true}
                        >
                            <DialogTitle id="max-width-dialog-title" style={{ fontWeight: 600, color: "#172b4d", textAlign: 'center' }}>Add a new product</DialogTitle>
                
                            <DialogContent>
                                <form onSubmit={this.handleSubmit}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} style={{ textAlign: 'left' }}>
                                            <TextField  
                                                id="outlined-basic" 
                                                label="Title" 
                                                variant="outlined"  
                                                name="title" 
                                                value={title} 
                                                onChange={this.handleChange} 
                                                style={{height:20, width:"100%", marginBottom:"50px"}}
                                            />
                                        </Grid >

                                        <Grid item xs={12} style={{ textAlign: 'left' }}>
                                            <p>Description</p>
                                            <Editor
                                                value={this.state.editorState}
                                                init={{
                                                    height: 250,
                                                    menubar: true
                                                }}
                                                onEditorChange={this.onEditorStateChange}
                                            />           
                                        </Grid >
                                    </Grid >

                                    <DialogActions style={{ margin: 8, marginRight: -8 }}>
                                        <Button onClick={() => this.setState({ openDialog: false })}>Cancel</Button>
                                        <Button type="submit" >Save</Button>
                                    </DialogActions>
                                </form>
                            </DialogContent>
                        </Dialog>

                        <Dialog
                            onClose={() => this.setState({ openDialogedit: false })}
                            aria-labelledby="simple-dialog-title"
                            open={openDialogedit}
                            maxWidth="md"
                            fullWidth={true}
                        >
                            <DialogTitle id="max-width-dialog-title" style={{ fontWeight: 600, color: "#172b4d", textAlign: 'center' }}>Edit a product</DialogTitle>

                            <DialogContent>
                                <form onSubmit={this.handleSubmitEdit}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} style={{ textAlign: 'left' }}>
                                            <TextField  
                                                id="outlined-basic" 
                                                label="Title" 
                                                variant="outlined"  
                                                name="title" 
                                                value={title} 
                                                onChange={this.handleChange} 
                                                style={{height:20, width:"100%", marginBottom:"50px"}}
                                            />
                                        </Grid >

                                        <Grid item xs={12} style={{ textAlign: 'left' }}>
                                            <p>Description</p>
                                            <Editor
                                                value={this.state.editorState}
                                                init={{
                                                    height: 250,
                                                    menubar: true
                                                }}
                                                onEditorChange={this.onEditorStateChange}
                                            />           
                                        </Grid >
                                    </Grid >
                                    <DialogActions style={{ margin: 8, marginRight: -8 }}>
                                        <Button onClick={() => this.setState({ openDialogedit: false })}>Cancel</Button>
                                        <Button type="submit" >Save</Button>
                                    </DialogActions>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                    
                </div>
        )  
    }
}