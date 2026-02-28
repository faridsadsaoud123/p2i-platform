import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData } from './DataContext';
import { Operation, RequestItem } from '../types';
import { useNotification } from './NotificationSystem';

const OperationForm: React.FC = () => {
  const { requests, operations, setOperations, updateRequest, updateOperation, transformRequestToOperation } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const reqFromState = (location.state as any)?.request as RequestItem | undefined;
  const opFromState = (location.state as any)?.operation as Operation | undefined;
  const [request, setRequest] = useState<RequestItem | null>(reqFromState || null);
  const [editingOp, setEditingOp] = useState<Operation | null>(opFromState || null);

  const [formData, setFormData] = useState<Partial<Operation>>({
    pfiCode: '',
    code_eotp: '',
    code_nacres: '',
    description: '',
    status: 'CREEE',
    startDate: '',
    endDate: '',
    dateClotureReelle: '',
    estimationInitial: 0
  });

  useEffect(() => {
    if (!request && reqFromState) {
      setRequest(reqFromState);
    }
    if (!editingOp && opFromState) {
      setEditingOp(opFromState);
    }
  }, [reqFromState, request, opFromState, editingOp]);

  useEffect(() => {
    if (request) {
      setFormData(prev => ({
        ...prev,
        title: request.title,
        description: request.description,
        site: request.site,
        priority: request.priority
      }));
    }
    if (editingOp) {
      setFormData({
        ...editingOp,
        // ensure existing array values are copied
        eotpCodes: editingOp.eotpCodes || [],
        nacresCodes: editingOp.nacresCodes || []
      });
    }
  }, [request, editingOp]);

  const handleSubmit = () => {
    if (editingOp) {
      // update existing operation
      updateOperation(editingOp.id, formData);
      showNotification('Opération mise à jour.', 'success');
      navigate('/operations', { state: { selectedOpId: editingOp.id } });
      return;
    }

    if (standalone) {
      // create operation without any linked request
      const newOpId = `OP-${new Date().getFullYear().toString().slice(-2)}-${(operations.length + 1).toString().padStart(3,'0')}`;
      const newOp: Operation = {
        id: newOpId,
        title: formData.title || 'Nouvelle opération',
        description: formData.description || '',
        site: formData.site || '',
        status: formData.status as Operation['status'] || 'CREEE',
        managerId: formData.managerId || 'u1',
        priority: formData.priority || 'P3',
        pfiCode: formData.pfiCode || `PFI-${Math.floor(1000+Math.random()*9000)}`,
        eotpCodes: formData.eotpCodes || [],
        nacresCodes: formData.nacresCodes || [],
        aeOpen: formData.estimationInitial || 0,
        aeEngaged: 0,
        cpForecast: formData.estimationInitial || 0,
        cpPaid: 0,
        estimationInitial: formData.estimationInitial,
        startDate: formData.startDate || new Date().toISOString().split('T')[0],
        endDate: formData.endDate || '',
        history: [{ date: new Date().toLocaleDateString('fr-FR'), user: 'Utilisateur', title: 'Opération initialisée', desc: 'Création manuelle.' }]
      };
      setOperations(prev => [newOp, ...prev]);
      showNotification('Opération créée.', 'success');
      navigate('/operations', { state: { selectedOpId: newOpId } });
      return;
    }

    if (!request) return;

    // build overrides from form data
    const overrides: Partial<Operation> = {
      title: formData.title || request.title,
      description: formData.description || request.description,
      site: formData.site || request.site,
      status: formData.status as Operation['status'] || 'CREEE',
      priority: formData.priority || request.priority,
      pfiCode: formData.pfiCode,
      eotpCodes: formData.eotpCodes,
      nacresCodes: formData.nacresCodes,
      aeOpen: formData.estimationInitial,
      cpForecast: formData.estimationInitial,
      estimationInitial: formData.estimationInitial,
      startDate: formData.startDate,
      endDate: formData.endDate,
      dateClotureReelle: formData.dateClotureReelle
    };

    const opId = transformRequestToOperation(request.id, undefined, overrides);
    if (opId) {
      showNotification('Opération créée à partir de la demande.', 'success');
      navigate('/operations', { state: { selectedOpId: opId } });
    } else {
      showNotification('Impossible de créer l\'opération, vérifiez l\'état de la demande.', 'error');
    }
  };

  const standalone = !request && !editingOp;
  const isEditing = Boolean(editingOp);


  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <h2 className="text-xl font-bold">
        {isEditing
          ? 'Modifier Opération'
          : standalone
            ? 'Nouvelle Opération'
            : `Créer Opération à partir de ${request?.id}`}
      </h2>
      {!isEditing && !standalone && <p className="text-gray-600">Titre demande : {request?.title}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block text-[10px] font-bold uppercase">Titre de l'opération</label>
          <input
            value={formData.title || ''}
            onChange={e => setFormData({...formData, title: e.target.value})}
            className="w-full p-3 border rounded"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase">Site</label>
          <input
            value={formData.site || ''}
            onChange={e => setFormData({...formData, site: e.target.value})}
            className="w-full p-3 border rounded"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase">Priorité</label>
          <select
            value={formData.priority || 'P3'}
            onChange={e => setFormData({...formData, priority: e.target.value as any})}
            className="w-full p-3 border rounded"
          >
            <option value="P1">P1 - Critique</option>
            <option value="P2">P2 - Haute</option>
            <option value="P3">P3 - Moyenne</option>
            <option value="P4">P4 - Basse</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase">Code PFI</label>
          <input value={formData.pfiCode || ''} onChange={e => setFormData({...formData, pfiCode: e.target.value})} className="w-full p-3 border rounded" />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase">Code EOTP</label>
          <input value={(formData.eotpCodes && formData.eotpCodes[0]) || ''} onChange={e => setFormData({...formData, eotpCodes: e.target.value ? [e.target.value] : []})} className="w-full p-3 border rounded" />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase">Code NACRES</label>
          <input value={(formData.nacresCodes && formData.nacresCodes[0]) || ''} onChange={e => setFormData({...formData, nacresCodes: e.target.value ? [e.target.value] : []})} className="w-full p-3 border rounded" />
        </div>
        <div className="col-span-2">
          <label className="block text-[10px] font-bold uppercase">Description</label>
          <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 border rounded" />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase">Date début prévue</label>
          <input type="date" value={formData.startDate || ''} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full p-3 border rounded" />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase">Date fin prévue</label>
          <input type="date" value={formData.endDate || ''} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full p-3 border rounded" />
        </div>
        <div className="col-span-2">
          <label className="block text-[10px] font-bold uppercase">Estimation initiale (€)</label>
          <input type="number" value={formData.estimationInitial || 0} onChange={e => setFormData({...formData, estimationInitial: Number(e.target.value)})} className="w-full p-3 border rounded" />
        </div>
      </div>
      <div className="flex justify-end gap-4">
        <button onClick={() => {
            if (editingOp) navigate('/operations');
            else if (request) navigate('/requests');
            else navigate('/operations');
          }} className="px-6 py-3 border rounded">Annuler</button>
        <button onClick={handleSubmit} className="px-6 py-3 bg-[#fe740e] text-white rounded">
          {isEditing ? 'Mettre à jour' : 'Créer Opération'}
        </button>
      </div>
    </div>
  );
};

export default OperationForm;
