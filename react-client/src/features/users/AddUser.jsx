import React, { useState } from 'react';
import {
  Box, TextField, Button, MenuItem, Typography, Grid
} from '@mui/material';
import { addUser } from './userSlice';
import { useDispatch } from 'react-redux';

export default function Register() {
  const dispatch = useDispatch()

  const [form1, setForm1] = useState({
    email: '',
    username: '',
    password: '',
    address: ''
  });

  const [errors1, setErrors1] = useState({});

  const handleChange1 = e => {
    setForm1({ ...form1, [e.target.name]: e.target.value });
  };

  const validate1 = () => {
    let temp = {};
    temp.email = form1.email && /\S+@\S+\.\S+/.test(form1.email) ? '' : 'Invalid email';
    temp.username = form1.username ? '' : 'Required';
    temp.password = form1.password ? '' : 'Required';
    temp.address = form1.address ? '' : 'Required';
    setErrors1(temp);
    return Object.values(temp).every(x => x === '');
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (validate1()) {
      dispatch(addUser(JSON.stringify(form1, null, 2)))
    }
  };

  return (
    <Box
      component="form1"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 480, mx: 'auto', mt: 5, p: 3, border: '1px solid #ccc', borderRadius: 2 }}
    >
      <Typography variant="h5" mb={2} sx={{textAlign: 'center'}}>הרשמה</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label='דוא"ל'
            name="email"
            value={form1.email}
            onChange={handleChange1}
            fullWidth
            error={!!errors1.email}
            helperText={errors1.email}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="שם משתמש"
            name="username"
            value={form1.username}
            onChange={handleChange1}
            fullWidth
            error={!!errors1.username}
            helperText={errors1.username}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="סיסמא"
            name="password"
            type="password"
            value={form1.password}
            onChange={handleChange1}
            fullWidth
            error={!!errors1.password}
            helperText={errors1.password}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="עיר"
            name="address"
            value={form1.address}
            onChange={handleChange1}
            fullWidth
            error={!!errors1.address}
            helperText={errors1.address}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" type="submit" fullWidth sx={{backgroundColor: '#ff9b8ca6', fontSize: "larger"}}>
            הרשמה
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}