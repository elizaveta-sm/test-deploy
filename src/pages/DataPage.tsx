import React, { useEffect, useState } from 'react';
import { fetchDataThunk, createDataThunk, updateDataThunk, deleteDataThunk, selectData, selectDataIsLoading, selectDataError } from '../app/data/dataSlice';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Alert } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { nanoid } from '@reduxjs/toolkit';
import Spinner from '../components/Spinner';

interface FormData {
    id?: string; 
    companySignatureName: string;
    documentName: string;
    documentStatus: string;
    documentType: string;
    employeeNumber: string;
    employeeSignatureName: string;
    companySigDate: string;  
    employeeSigDate: string;  
}

const defaultFormData: FormData = {
    companySignatureName: '',
    documentName: '',
    documentStatus: '',
    documentType: '',
    employeeNumber: '',
    employeeSignatureName: '',
    companySigDate: '',
    employeeSigDate: ''
}

const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const hasAllValues = (formData: FormData): boolean => {
    return Object.values(formData).every(value => value.trim() !== '');
};

const DataPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const data = useAppSelector(selectData);
    const dataIsLoading = useAppSelector(selectDataIsLoading);
    const dataError = useAppSelector(selectDataError);

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            dispatch(fetchDataThunk(token));
        }
    }, [dispatch, token]);

    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState(defaultFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [formSuccess, setFormSuccess] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setIsEditing(false);
        setFormData(defaultFormData);
        setSelectedId(null);
        setFormError(null);
    };

    const handleOpenModal = (editMode: boolean, dataToEdit?: FormData) => {
        if (editMode && dataToEdit?.id) {
            setIsEditing(true);
            setSelectedId(dataToEdit.id);
            setFormData({
                ...dataToEdit,
                companySigDate: formatDate(dataToEdit.companySigDate),
                employeeSigDate: formatDate(dataToEdit.employeeSigDate),
            });

        } else if (!editMode) {
            setIsEditing(false);
            setFormData(defaultFormData);
        }

        setModalOpen(true);
    };

    const handleAdd = async () => {
        
        if (!hasAllValues(formData)) {
            setFormError('Fill all the fields.')
            return;
        }
        
        if (token && !isEditing) {
            
            const newData = {
                ...formData,
                id: nanoid(),
                companySigDate: new Date(formData.companySigDate).toISOString(),
                employeeSigDate: new Date(formData.employeeSigDate).toISOString(),
            };
            
            try {
                setIsSubmitting(true);
                await dispatch(createDataThunk({ token, newData })).unwrap();
                setFormSuccess('Data added successfully!');
                handleCloseModal();

            } catch (error) {
                setFormError('Failed to add data.')

            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleUpdate = async () => {

        if (!hasAllValues(formData)) {
            setFormError('Fill all the fields.')
            return;
        }

        if (token && isEditing) {
            
            try {
                setIsSubmitting(true);

                const updatedData = {
                    ...formData,
                    companySigDate: new Date(formData.companySigDate).toISOString(),
                    employeeSigDate: new Date(formData.employeeSigDate).toISOString(),
                };

                if (selectedId !== null) {
                    await dispatch(updateDataThunk({ 
                        token, 
                        id: selectedId, 
                        updatedData,
                    })).unwrap();
                }

                setFormSuccess('Data updated successfully!');
                handleCloseModal();

            } catch (error) {
                setFormError('Failed to update data.')

            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (token) {
            try {
                await dispatch(deleteDataThunk({ token, id })).unwrap();
                setFormSuccess('Data deleted successfully!');
                
            } catch (error) {
                setFormError('Failed to delete data.')
            }
        }
    };

    if (dataIsLoading) return <Spinner />;
    if (dataError) return <p>Error: {dataError}</p>;

    return (
        <>
            { formSuccess && <Alert severity="success">{formSuccess}</Alert> }

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Company Sig Date</TableCell>
                            <TableCell>Company Signature Name</TableCell>
                            <TableCell>Document Name</TableCell>
                            <TableCell>Document Status</TableCell>
                            <TableCell>Document Type</TableCell>
                            <TableCell>Employee Number</TableCell>
                            <TableCell>Employee Sig Date</TableCell>
                            <TableCell>Employee Signature Name</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { data.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.companySigDate}</TableCell>
                                <TableCell>{row.companySignatureName}</TableCell>
                                <TableCell>{row.documentName}</TableCell>
                                <TableCell>{row.documentStatus}</TableCell>
                                <TableCell>{row.documentType}</TableCell>
                                <TableCell>{row.employeeNumber}</TableCell>
                                <TableCell>{row.employeeSigDate}</TableCell>
                                <TableCell>{row.employeeSignatureName}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleOpenModal(true, row)}>Update</Button>
                                    <Button onClick={() => {
                                        if (row.id) {
                                            handleDelete(row.id);
                                        }
                                    }}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        )) }
                    </TableBody>
                </Table>
                <Button onClick={() => handleOpenModal(false, defaultFormData)}>Add</Button>
            </TableContainer>

            <Dialog open={modalOpen} onClose={handleCloseModal}>
                <DialogTitle>{isEditing ? 'Update Item' : 'Add New Item'}</DialogTitle>
                <DialogContent>
                    { formError && <Alert severity="error">{formError}</Alert> }

                    <TextField
                        name="companySignatureName"
                        label="Company Signature Name"
                        value={formData.companySignatureName}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        name="documentName"
                        label="Document Name"
                        value={formData.documentName}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        name="documentStatus"
                        label="Document Status"
                        value={formData.documentStatus}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        name="documentType"
                        label="Document Type"
                        value={formData.documentType}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        name="employeeNumber"
                        label="Employee Number"
                        value={formData.employeeNumber}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        name="employeeSignatureName"
                        label="Employee Signature Name"
                        value={formData.employeeSignatureName}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        name="companySigDate"
                        label="Company Signature Date"
                        type="date"
                        value={formData.companySigDate}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        required
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        name="employeeSigDate"
                        label="Employee Signature Date"
                        type="date"
                        value={formData.employeeSigDate}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        Cancel
                    </Button>

                    <Button 
                        onClick={isEditing ? handleUpdate : handleAdd} 
                        color="primary" 
                        disabled={isSubmitting}
                    >
                        { isSubmitting ? <CircularProgress size={24} /> : isEditing ? 'Update' : 'Add' }
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DataPage;
