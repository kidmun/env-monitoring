import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
const DeleteEventModal = ({ eventTitle, onDelete }) => {
  const [open, setOpen] = useState(true);
    const navigate = useNavigate();
 
    const { eventId } = useParams();
    console.log(eventId)
  const handleClose = () => {
    navigate("/events")
  };

  const handleDelete = () => {
   fetch("http://localhost:8080/delete-event/"+ eventId,{
    method: "DELETE"
   }).then(response => {
    if (!response.ok){
        throw response
    }
   }).then(res => {
    console.log(res)
    navigate("/events")
   }).catch(err => {
    console.log(err)
   })
    

  };

  return (
    <>
   
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete the event?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteEventModal;
