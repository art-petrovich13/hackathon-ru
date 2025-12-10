// src/pages/AdminPage/hooks/useUsers.ts
import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { 
  getUsers, updateUser, resetUserPassword, deleteUser
} from '../../../utils/api/admin';
import type { 
   
  AdminUser, UserFormData 
} from '../../../utils/api/admin';
import type { UserFilters, PaginationState } from '../types';

export const useUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0
  });

  const loadUsers = useCallback(async (filters: UserFilters, page: number) => {
    setIsLoading(true);
    try {
      const data = await getUsers({
        ...filters,
        page,
        per_page: 20
      });
      
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error: any) {
      toast.error(error.message || 'Ошибка загрузки пользователей');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUpdateUser = useCallback(async (id: number, data: Partial<UserFormData>) => {
    try {
      await updateUser(id, data);
      toast.success('Пользователь успешно обновлен');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Ошибка обновления пользователя');
      return false;
    }
  }, []);

  const handleResetPassword = useCallback(async (id: number, password: string) => {
    try {
      await resetUserPassword(id, password);
      toast.success('Пароль успешно сброшен');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Ошибка сброса пароля');
      return false;
    }
  }, []);

  const handleDeleteUser = useCallback(async (id: number) => {
    try {
      await deleteUser(id);
      toast.success('Пользователь успешно удален');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Ошибка удаления пользователя');
      return false;
    }
  }, []);

  return {
    users,
    isLoading,
    pagination,
    loadUsers,
    handleUpdateUser,
    handleResetPassword,
    handleDeleteUser
  };
};