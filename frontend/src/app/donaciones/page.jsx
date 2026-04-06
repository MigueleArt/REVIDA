import { redirect } from 'next/navigation';

export default function DonacionesPage() {
    // Redirigir a la vista unificada de donaciones en el dashboard
    redirect('/dashboard/mis-donativos');
}
