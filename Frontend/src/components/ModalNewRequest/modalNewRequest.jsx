import React, { useState } from 'react';



export default function ModalNewRequest ({ isOpen, onClose, onSubmit }){
    const [requestData, setRequestData] = useState({
        title: '',
        description: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRequestData({
            ...requestData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(requestData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Nova Solicitação</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Título</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={requestData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Descrição</label>
                        <textarea
                            id="description"
                            name="description"
                            value={requestData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Cancelar</button>
                        <button type="submit">Enviar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

