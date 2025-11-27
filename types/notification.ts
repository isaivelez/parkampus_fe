export interface Notification {
    _id: string;
    sender_id: string;
    type: 'CIERRE_NOCTURNO' | 'LIBERACION_HORA_PICO' | 'CIERRE_SEGURIDAD' | 'EVENTO_INSTITUCIONAL' | 'MANTENIMIENTO_EMERGENCIA';
    subject: string;
    recipients_count: number;
    created_at: string;
}

export interface NotificationHistoryResponse {
    success: boolean;
    data: Notification[];
}
