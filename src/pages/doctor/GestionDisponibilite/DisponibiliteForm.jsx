import React, { useState, useEffect } from 'react';
import { Modal, Form, TimePicker, Select, Button, message } from 'antd';
import moment from 'moment';

const DisponibiliteForm = ({ open, onCancel, onSave, creneau, date }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Initialiser ou réinitialiser les champs
  useEffect(() => {
    if (open) {
      if (creneau) {
        form.setFieldsValue({
          debut: moment(creneau.debut, 'HH:mm'),
          fin: moment(creneau.fin, 'HH:mm'),
          type: creneau.type
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, creneau, form]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const creneauData = {
        id: creneau?.id,
        debut: values.debut.format('HH:mm'),
        fin: values.fin.format('HH:mm'),
        type: values.type
      };

      onSave(creneauData);
      message.success('Créneau enregistré');
      form.resetFields();
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={creneau ? 'Modifier un créneau' : 'Ajouter un créneau'}
      open={open}
      onCancel={handleCancel}
      destroyOnHidden // ✅ nouvelle prop recommandée avec Antd v5
      footer={[
        <Button key="back" onClick={handleCancel}>
          Annuler
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          Enregistrer
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        {date && (
          <Form.Item label="Date">
            <div className="ant-input">{date}</div>
          </Form.Item>
        )}

        <Form.Item
          label="Heure de début"
          name="debut"
          rules={[{ required: true, message: 'Heure de début requise' }]}
        >
          <TimePicker format="HH:mm" minuteStep={15} />
        </Form.Item>

        <Form.Item
          label="Heure de fin"
          name="fin"
          rules={[
            { required: true, message: 'Heure de fin requise' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || !getFieldValue('debut') || value.isAfter(getFieldValue('debut'))) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("L'heure de fin doit être après l'heure de début"));
              },
            }),
          ]}
        >
          <TimePicker format="HH:mm" minuteStep={15} />
        </Form.Item>

        <Form.Item
          label="Type de consultation"
          name="type"
          rules={[{ required: true, message: 'Type requis' }]}
        >
          <Select placeholder="Choisir le type de consultation">
            <Select.Option value="consultation">Consultation à l'hôpital</Select.Option>
            <Select.Option value="teleconsultation">Téléconsultation</Select.Option>
            <Select.Option value="domicile">Consultation à domicile</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DisponibiliteForm;
