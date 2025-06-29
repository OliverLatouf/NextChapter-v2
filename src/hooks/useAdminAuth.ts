import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'super_admin';
  permissions: Record<string, boolean>;
}

export const useAdminAuth = () => {
  const { user } = useAuth();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setAdminUser(null);
        setIsAdmin(false);
        setIsSuperAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id, email, name, role, permissions')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (profile && (profile.role === 'admin' || profile.role === 'super_admin')) {
          setAdminUser(profile);
          setIsAdmin(true);
          setIsSuperAdmin(profile.role === 'super_admin');
        } else {
          setAdminUser(null);
          setIsAdmin(false);
          setIsSuperAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setAdminUser(null);
        setIsAdmin(false);
        setIsSuperAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  const logAdminAction = async (
    action_type: string,
    target_type: string,
    target_id?: string,
    details?: Record<string, unknown>
  ) => {
    if (!adminUser) return;

    try {
      await supabase.from('admin_actions').insert({
        admin_id: adminUser.id,
        action_type,
        target_type,
        target_id,
        details
      });
    } catch (error) {
      console.error('Error logging admin action:', error);
    }
  };

  const grantAdminAccess = async (userId: string, role: 'admin' | 'super_admin' = 'admin') => {
    if (!isSuperAdmin) throw new Error('Only super admins can grant admin access');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);

      if (error) throw error;

      await logAdminAction('grant_admin_access', 'user', userId, { role });
      return true;
    } catch (error) {
      console.error('Error granting admin access:', error);
      throw error;
    }
  };

  const revokeAdminAccess = async (userId: string) => {
    if (!isSuperAdmin) throw new Error('Only super admins can revoke admin access');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'user', permissions: {} })
        .eq('id', userId);

      if (error) throw error;

      await logAdminAction('revoke_admin_access', 'user', userId);
      return true;
    } catch (error) {
      console.error('Error revoking admin access:', error);
      throw error;
    }
  };

  return {
    adminUser,
    loading,
    isAdmin,
    isSuperAdmin,
    logAdminAction,
    grantAdminAccess,
    revokeAdminAccess
  };
};
