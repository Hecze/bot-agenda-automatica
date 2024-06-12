import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const getFullCurrentDate = (): string => {
    const peruTime = new Date(); // Crear objeto Date sin formato específico
    peruTime.toLocaleString('en-US', { timeZone: 'America/Lima' }); // Establecer la zona horaria
    const formatDate = format(peruTime, 'yyyy/MM/dd HH:mm', { locale: es }); // Formato "yyyy/MM/dd HH:mm"
    const day = format(peruTime, 'EEEE', { locale: es }); // Obtener el día de la semana en español

    return [
        formatDate,
        day,
    ].join(' ');
}

export { getFullCurrentDate };
