// src/pages/AdminPage/hooks/useEvents.ts
import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import {
    getAdminEvents, getAdminEvent, createEvent, updateEvent, deleteEvent, exportParticipants,

} from '../../../utils/api/admin';
import type { AdminEvent }
    from '../../../utils/api/admin';
import type { EventFilters, PaginationState, EventFormState } from '../types';

export const useEvents = () => {
    const [events, setEvents] = useState<AdminEvent[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState<PaginationState>({
        current_page: 1,
        last_page: 1,
        per_page: 20,
        total: 0
    });

    const loadEvents = useCallback(async (filters: EventFilters, page: number) => {
        setIsLoading(true);
        try {
            const data = await getAdminEvents({
                ...filters,
                page,
                per_page: 20
            });

            setEvents(data.events);
            setPagination(data.pagination);
        } catch (error: any) {
            toast.error(error.message || 'Ошибка загрузки событий');
            setEvents([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleCreateEvent = useCallback(async (formData: FormData) => {
        try {
            await createEvent(formData);
            toast.success('Событие успешно создано');
            return true;
        } catch (error: any) {
            toast.error(error.message || 'Ошибка создания события');
            return false;
        }
    }, []);

    const handleUpdateEvent = useCallback(async (id: number, formData: FormData) => {
        try {
            await updateEvent(id, formData);
            toast.success('Событие успешно обновлено');
            return true;
        } catch (error: any) {
            toast.error(error.message || 'Ошибка обновления события');
            return false;
        }
    }, []);

    const handleDeleteEvent = useCallback(async (id: number) => {
        try {
            await deleteEvent(id);
            toast.success('Событие успешно удалено');
            return true;
        } catch (error: any) {
            toast.error(error.message || 'Ошибка удаления события');
            return false;
        }
    }, []);

    const handleExportParticipants = useCallback(async (eventId: number) => {
        try {
            await exportParticipants(eventId);
            toast.success('Экспорт участников завершен');
            return true;
        } catch (error: any) {
            toast.error(error.message || 'Ошибка экспорта участников');
            return false;
        }
    }, []);

    const getEvent = useCallback(async (id: number) => {
        try {
            const response = await getAdminEvent(id);
            return response.event;
        } catch (error: any) {
            toast.error(error.message || 'Ошибка загрузки события');
            return null;
        }
    }, []);

    return {
        events,
        isLoading,
        pagination,
        loadEvents,
        handleCreateEvent,
        handleUpdateEvent,
        handleDeleteEvent,
        handleExportParticipants,
        getEvent
    };
};