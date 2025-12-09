import { useState, useEffect } from 'react';
import supabase from '../utils/supabase';

interface Ticket {
  id: string;
  patientName: string;
  patientEmail: string;
  appointmentDate: string;
  appointmentTime: string;
  doctorName: string;
  doctorSpecialty: string;
  clinicName: string;
  clinicAddress: string;
  status: 'active' | 'used' | 'cancelled';
  appointmentId: string;
  createdAt: string;
}

export function useTickets(user: any) {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const removeTicket = async (ticketId: string) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', ticketId);

      if (error) throw error;
      setTickets(tickets.filter(ticket => ticket.id !== ticketId));
    } catch (error) {
      console.error('Error removing ticket:', error);
      alert('Ошибка при удалении талона');
    }
  };

  return { tickets, removeTicket };
}