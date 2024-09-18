import { AlignCenter } from 'lucide-react';
import React from 'react';
import { FaEdit } from "react-icons/fa";
import { GoXCircleFill, GoFileDirectoryFill } from "react-icons/go";
import { GrUpdate } from "react-icons/gr";


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
    { id: 1, solicitante: 'Dr. Ronald Cavalcanti', convenio: 'SulAmerica', exame: 'OCT - Tomografia', name: 'Maria da Conceicao Batista Silva Duarte Coelho', dataSolicitacao: '2023-10-01', status: 'Analise', observacao: 'Nenhuma observação' },
    { id: 2, solicitante: 'Dr. Brown', convenio: 'Plan B', exame: 'X-Ray', name: 'Jane Smith', dataSolicitacao: '2023-10-02', status: 'Pendente', observacao: 'Ver pendencia' },
    { id: 3, solicitante: 'Dr. White', convenio: 'Plan C', exame: 'MRI', name: 'Sam Johnson', dataSolicitacao: '2023-10-03', status: 'Autorizado', observacao: 'Ver Validade' },
    { id: 4, solicitante: 'Dr. Black', convenio: 'Plan D', exame: 'CT Scan', name: 'Chris Brown', dataSolicitacao: '2023-10-04', status: 'Negado', observacao: 'Ver motivo' },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Analise':
        return { background: 'white', color: '#0056b3', border: '1px solid #0056b3', padding: '5px 16px', borderRadius: '16px', fontWeight: 'bold', textAlign: 'center', width: '100px' };
      case 'Pendente':
        return { background: 'orange', color: 'white', padding: '5px 16px', borderRadius: '16px', fontWeight: 'bold', textAlign: 'center', width: '100px' };
      case 'Autorizado':
        return { background: 'green', color: 'white', padding: '5px 16px', borderRadius: '16px', fontWeight: 'bold', textAlign: 'center', width: '100px' };
      case 'Negado':
        return { background: 'red', color: 'white', padding: '5px 16px', borderRadius: '16px', fontWeight: 'bold', textAlign: 'center', width: '100px' };
      default:
        return {};
    }
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
          <tr key={row.id} style={{ backgroundColor: index % 2 === 0 ? '#ffffffff' : '#dadadac0' }}>
            {columns.map((column) => (
              <td key={column.key} style={{ fontSize: '10px'}}>
                {column.key === 'status' ? (
                  <span style={getStatusStyle(row.status)}>{row[column.key]}</span>
                ) : (
                  row[column.key]
                )}
              </td>
            ))}
            <td className='gap-3' style={{ padding: '10px', borderRadius: '5px', fontSize: '10px' }}>
              <button className='bg-[#0056b3] text-white p-2 rounded'><GoFileDirectoryFill /></button>
              <button className='bg-[#0056b3] text-white p-2 rounded'><GrUpdate /></button>
              <button className='bg-[#0056b3] text-white p-2 rounded'><FaEdit /></button>
              <button className='bg-[#ff0000] text-white p-2 rounded'><GoXCircleFill /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
