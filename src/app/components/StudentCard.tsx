// StudentCard.tsx actualizado
import { useDrag } from 'react-dnd';
import { useNavigate } from 'react-router';
import { Estudiante } from '@/types';

interface StudentCardProps {
  student: Estudiante;
}

export function StudentCard({ student }: StudentCardProps) {
  const navigate = useNavigate();
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'student',
    item: { 
      id: student.id, 
      time: student.horaClase
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const statusColors = {
    pagado: 'bg-green-500/10 text-green-400',
    pendiente: 'bg-[#C10801]/20 text-[#C10801]',
    parcial: 'bg-[#F16001]/20 text-[#F16001]',
  };

  const handleClick = () => {
    navigate(`/estudiante/${student.id}`);
  };

  return (
    <div
      ref={drag}
      onClick={handleClick}
      className={`bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm rounded-lg border border-[#F16001]/30 p-4 cursor-pointer transition-all ${
        isDragging ? 'opacity-50' : 'hover:border-[#F16001] hover:shadow-lg hover:shadow-[#F16001]/20'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-[#D9C3AB] truncate">{student.nombre}</h4>
        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[student.estadoPago]}`}>
          {student.estadoPago === 'pagado' ? '✓' : student.estadoPago === 'pendiente' ? '!' : '~'}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-[#D9C3AB]/70">{student.horaClase}</span>
        <span className="text-[#D9C3AB]/70">${student.montoMensual.toLocaleString('es-CL')}</span>
      </div>
    </div>
  );
}