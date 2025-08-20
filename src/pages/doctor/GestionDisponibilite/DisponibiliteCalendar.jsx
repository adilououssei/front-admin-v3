import React, { useState, useEffect } from 'react';
import { Calendar, Badge, Button, Alert, Modal, Form, DatePicker, TimePicker, Select } from 'antd';
import moment from 'moment';
import 'antd/dist/reset.css';
import { getDisponibilites, saveDisponibilite } from '../../../api/disponibilitesApi';

const DisponibiliteCalendar = () => {
  const [disponibilites, setDisponibilites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentDispo, setCurrentDispo] = useState(null);
  const [alert, setAlert] = useState(null);

  const docteurId = 1; // à remplacer par l'id du docteur connecté

  useEffect(() => {
    loadDisponibilites();
  }, []);

  const loadDisponibilites = async () => {
    try {
      const data = await getDisponibilites(docteurId);

      const formatted = data.map(dispo => ({
        ...dispo,
        creneaux: dispo.creneaux.map(cr => ({
          ...cr,
          debut: cr.debut ? moment(cr.debut, 'HH:mm') : null,
          fin: cr.fin ? moment(cr.fin, 'HH:mm') : null
        }))
      }));

      // Supprime les doublons par date
      const uniqueDispos = Array.from(new Map(formatted.map(d => [d.date, d])).values());
      setDisponibilites(uniqueDispos);
    } catch {
      console.error('Erreur chargement dispos');
      setAlert({ type: 'error', message: 'Impossible de charger les disponibilités' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const onDateSelect = (date) => {
    const dateStr = date.format('YYYY-MM-DD');
    const dispoExist = disponibilites.find(d => d.date === dateStr);

    if (dispoExist) {
      setCurrentDispo(dispoExist);
    } else {
      setCurrentDispo({ date: dateStr, creneaux: [] });
    }
    setShowModal(true);
  };

  const cellRender = (date, info) => {
    if (info.type !== 'date') return info.originNode;

    const dateStr = date.format('YYYY-MM-DD');
    const dispo = disponibilites.find(d => d.date === dateStr);
    if (!dispo) return info.originNode;

    return (
      <div>
        {dispo.creneaux.map((cr, index) => (
          <div key={cr.id ?? `${dateStr}-${index}-${Math.random()}`} style={{ marginBottom: 4 }}>
            <Badge
              status={
                cr.type === 'consultation'
                  ? 'success'
                  : cr.type === 'teleconsultation'
                  ? 'processing'
                  : 'warning'
              }
              text={`${cr.debut ? cr.debut.format('HH:mm') : ''} - ${cr.fin ? cr.fin.format('HH:mm') : ''}`}
            />
          </div>
        ))}
      </div>
    );
  };

  const handleSave = async (updatedDispo) => {
    try {
      await saveDisponibilite(updatedDispo);
      await loadDisponibilites(); // Recharge les disponibilités après sauvegarde
      setAlert({ type: 'success', message: 'Disponibilité sauvegardée' });
      setShowModal(false);
    } catch {
      setAlert({ type: 'error', message: 'Erreur sauvegarde' });
    }
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Gestion des disponibilités</h2>

      {alert && <Alert message={alert.message} type={alert.type} closable onClose={() => setAlert(null)} style={{ marginBottom: 16 }} />}

      <Calendar
        key={disponibilites.length} // force le re-render du calendrier
        onSelect={onDateSelect}
        cellRender={cellRender}
      />

      {showModal && currentDispo && (
        <DisponibiliteModal
          disponibilite={currentDispo}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const DisponibiliteModal = ({ disponibilite, onClose, onSave }) => {
  const [form] = Form.useForm();
  const [creneaux, setCreneaux] = useState(disponibilite.creneaux || []);

  const addCreneau = () => {
    setCreneaux([...creneaux, { id: null, debut: null, fin: null, type: 'consultation' }]);
  };

  const updateCreneau = (index, field, value) => {
    const newCreneaux = [...creneaux];
    newCreneaux[index][field] = value;
    setCreneaux(newCreneaux);
  };

  const removeCreneau = (index) => {
    const newCreneaux = [...creneaux];
    newCreneaux.splice(index, 1);
    setCreneaux(newCreneaux);
  };

  const submit = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();

      const formattedCreneaux = creneaux.map(cr => ({
        id: cr.id,
        debut: cr.debut ? cr.debut.format('HH:mm') : null,
        fin: cr.fin ? cr.fin.format('HH:mm') : null,
        type: cr.type,
      }));

      const dataToSave = {
        ...disponibilite,
        date: values.date.format('YYYY-MM-DD'),
        creneaux: formattedCreneaux,
      };

      await onSave(dataToSave);
      onClose();
    } catch (e) {
      console.log('Erreur validation', e);
    }
  };

  useEffect(() => {
    if (disponibilite?.date) {
      form.setFieldsValue({ date: moment(disponibilite.date) });
    }
  }, [disponibilite, form]);

  return (
    <Modal
      title={disponibilite.id ? 'Modifier Disponibilité' : 'Nouvelle Disponibilité'}
      open={true}
      onCancel={onClose}
      onOk={submit}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: 'Date requise' }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>

        <div>
          <h4>Créneaux</h4>
          {creneaux.map((creneau, idx) => (
            <div key={`${disponibilite.date}-${idx}`} style={{ marginBottom: 12, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
              <TimePicker
                format="HH:mm"
                value={creneau.debut}
                onChange={(time) => updateCreneau(idx, 'debut', time)}
                placeholder="Début"
                style={{ marginRight: 10 }}
              />
              <TimePicker
                format="HH:mm"
                value={creneau.fin}
                onChange={(time) => updateCreneau(idx, 'fin', time)}
                placeholder="Fin"
                style={{ marginRight: 10 }}
              />
              <Select
                value={creneau.type}
                onChange={(val) => updateCreneau(idx, 'type', val)}
                style={{ width: 180, marginRight: 10 }}
              >
                <Select.Option value="consultation">Consultation</Select.Option>
                <Select.Option value="teleconsultation">Téléconsultation</Select.Option>
                <Select.Option value="domicile">Consultation domicile</Select.Option>
              </Select>
              <Button danger onClick={() => removeCreneau(idx)}>Supprimer</Button>
            </div>
          ))}

          <Button type="dashed" onClick={addCreneau} block>+ Ajouter un créneau</Button>
        </div>
      </Form>
    </Modal>
  );
};

export default DisponibiliteCalendar;
