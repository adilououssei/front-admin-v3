import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';

const SpecialiteForm = ({ show, onHide, specialite, onSave }) => {
    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        active: true
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (specialite) {
            setFormData({
                nom: specialite.nom,
                description: specialite.description,
                active: specialite.active
            });
        } else {
            setFormData({
                nom: '',
                description: '',
                active: true
            });
        }
        setErrors({});
    }, [specialite]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const validate = () => {
        const newErrors = {};

        // Sécurise l’accès avec '' par défaut
        const nom = formData.nom || '';
        const description = formData.description || '';

        if (!nom.trim()) newErrors.nom = 'Le nom est requis';
        if (nom.length > 50) newErrors.nom = 'Le nom est trop long (max 50 caractères)';
        if (description.length > 200) newErrors.description = 'La description est trop longue (max 200 caractères)';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSave({
                ...formData,
                id: specialite?.id
            });
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{specialite ? 'Modifier' : 'Ajouter'} une spécialité</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Nom de la spécialité *</Form.Label>
                        <Form.Control
                            name="nom"
                            value={formData.nom}
                            onChange={handleChange}
                            isInvalid={!!errors.nom}
                            placeholder="Ex: Cardiologie"
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.nom}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            isInvalid={!!errors.description}
                            placeholder="Description de la spécialité..."
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.description}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                            Maximum 200 caractères
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="switch"
                            id="active-switch"
                            label="Spécialité active"
                            name="active"
                            checked={formData.active}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Annuler
                    </Button>
                    <Button variant="primary" type="submit">
                        Enregistrer
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default SpecialiteForm;