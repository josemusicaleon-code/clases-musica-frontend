import { useDrop } from 'react-dnd';
import { Estudiante } from '@/types'; // Cambiar de Student a Estudiante
import { StudentCard } from '@/app/components/StudentCard';

interface DayColumnProps {
  day: Estudiante['diaSemana']; // Cambiar tipos
  students: Estudiante[]; // Mantener como "students" porque StudentCard aún usa inglés
  onDrop: (estudianteId: string, day: Estudiante['diaSemana'], time: string) => void; // Cambiar tipos
}

export function DayColumn({ day, students, onDrop }: DayColumnProps) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'student',
    drop: (item: { id: string; time: string }) => {
      onDrop(item.id, day, item.time);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  const dayNames: Record<Estudiante['diaSemana'], string> = { // Cambiar tipos
    lunes: 'Lunes',
    martes: 'Martes',
    miércoles: 'Miércoles',
    jueves: 'Jueves',
    viernes: 'Viernes',
    sábado: 'Sábado',
  };

  return (
    <div
      ref={drop}
      className={`bg-black/20 backdrop-blur-sm rounded-lg border-2 transition-all ${
        isOver && canDrop
          ? 'border-[#F16001] bg-[#F16001]/10 shadow-lg shadow-[#F16001]/20'
          : 'border-[#F16001]/20'
      }`}
    >
      <div className="p-4 border-b border-[#F16001]/20 bg-gradient-to-r from-[#F16001]/10 to-transparent">
        <h3 className="font-semibold text-[#D9C3AB]">{dayNames[day]}</h3>
        <p className="text-sm text-[#D9C3AB]/60">{students.length} clases</p>
      </div>
      <div className="p-3 space-y-3 min-h-[400px]">
        {students.map(student => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>
    </div>
  );
}