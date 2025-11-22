/**
 * Schedule types and constants
 */

export interface ScheduleDay {
    day: string;
    start_time: string;
    end_time: string;
}

export const DAYS_OF_WEEK = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado'
] as const;

export type DayOfWeek = typeof DAYS_OF_WEEK[number];
