import { redirect } from 'next/navigation';

export default function DashboardDonacionesPage() {
    // Redirigir a la vista unificada de donaciones
    redirect('/dashboard/mis-donativos');
}