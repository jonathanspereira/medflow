import React, { useState } from 'react';
import { FaEdit } from "react-icons/fa";
import { GoXCircleFill, GoFileDirectoryFill } from "react-icons/go";
import { GrUpdate } from "react-icons/gr";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Hover from './hover';

const Table = () => {
  const columns = [
    { key: 'id', label: 'Codigo' },
    { key: 'solicitante', label: 'Solicitante' },
    { key: 'convenio', label: 'Convenio' },
    { key: 'exame', label: 'Exame' },
    { key: 'name', label: 'Nome' },
    { key: 'dataSolicitacao', label: 'Data de Solicitação' },
    { key: 'status', label: 'Status' },
    { key: 'observacao', label: 'Observações' },
  ];

  const data = [
    { id: 1, solicitante: 'Dr. Ronald Cavalcanti', convenio: 'SulAmerica', exame: 'OCT - Tomografia', name: 'Maria da Conceicao Batista Silva Duarte Coelho', dataSolicitacao: '2023-10-01', status: 'Analise' },
    { id: 2, solicitante: 'Dr. Brown', convenio: 'Plan B', exame: 'X-Ray', name: 'Jane Smith', dataSolicitacao: '2023-10-02', status: 'Pendente' },
    { id: 3, solicitante: 'Dr. White', convenio: 'Plan C', exame: 'MRI', name: 'Sam Johnson', dataSolicitacao: '2023-10-03', status: 'Autorizado' },
    { id: 4, solicitante: 'Dr. Black', convenio: 'Plan D', exame: 'CT Scan', name: 'Chris Brown', dataSolicitacao: '2023-10-04', status: 'Negado' },
  ];

  const getStatusStyle = (status) => {
    const styles = {
      Analise: { background: 'white', color: '#0056b3', border: '1px solid #0056b3' },
      Pendente: { background: 'orange', color: 'white' },
      Autorizado: { background: 'green', color: 'white' },
      Negado: { background: 'red', color: 'white' },
    };
    return { ...styles[status], padding: '5px 16px', borderRadius: '16px', fontWeight: 'bold', textAlign: 'center', width: '100px' };
  };

  const [selectedStatus, setSelectedStatus] = useState('');

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };

  return (
    <table className='shadow-lg'>
      <thead className='bg-[#0056b3]'>
        <tr>
          {columns.map((column) => (
            <th key={column.key} style={{ color: 'blue', padding: '10px', borderRadius: '5px', fontSize: '10px' }}>{column.label}</th>
          ))}
          <th style={{ color: 'blue', padding: '10px', borderRadius: '5px', fontSize: '10px' }}>Ações</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={row.id} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#dadadac0' }}>
            {columns.map((column) => (
              <td key={column.key} style={{ fontSize: '10px' }}>
                {column.key === 'status' ? (
                  <span style={getStatusStyle(row.status)}>{row[column.key]}</span>
                ) : column.key === 'observacao' && (row.status === 'Autorizado' || row.status === 'Negado' || row.status === 'Pendente') ? (
                  <Hover status={row.status} />
                ) : column.key === 'dataSolicitacao' ? (
                  new Date(row[column.key]).toLocaleDateString()
                ) : (
                  row[column.key]
                )}
              </td>
            ))}
            <td className='gap-2' style={{ padding: '10px', borderRadius: '5px', fontSize: '10px' }}>
              <Button><GoFileDirectoryFill /></Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline"><GrUpdate /></Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Atualizar Status</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="status" className="text-right">
                        Status
                      </Label>
                      <Select onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-[250px]">
                          <SelectValue placeholder="Analise" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Autorizado">Autorizado</SelectItem>
                          <SelectItem value="Pendente">Pendente</SelectItem>
                          <SelectItem value="Negado">Negado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="additionalInfo" className="text-right">
                        {selectedStatus === 'Autorizado' && 'Data de Validade'}
                        {selectedStatus === 'Pendente' && 'Pendência'}
                        {selectedStatus === 'Negado' && 'Motivo'}
                      </Label>
                      <Textarea id="additionalInfo" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Atualizar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button><FaEdit /></Button>
              <Button style={{ background: 'red' }}><GoXCircleFill /></Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
