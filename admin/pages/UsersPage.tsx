import React, { useContext } from 'react';
import { AppContext } from '../App';
import { SimpleCardEditor } from '../components/SimpleCardEditor';
import { User as UserIcon, Shield } from 'lucide-react';
import { User } from '../types';

export const UsersPage: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { users, addUser, updateUser, deleteUser } = context;

  const renderUserCard = (user: User) => (
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
        user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
      }`}>
        {user.firstname[0]}{user.lastname[0]}
      </div>
      <div>
        <h3 className="font-bold text-slate-800">{user.firstname} {user.lastname}</h3>
        <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5 uppercase tracking-wide">
            {user.role === 'admin' ? <Shield size={12} /> : <UserIcon size={12} />}
            {user.role === 'admin' ? 'Admin' : 'Kellner'}
        </div>
        <p className="text-xs text-slate-400 mt-1">@{user.username}</p>
      </div>
    </div>
  );

  return (
    <SimpleCardEditor<User>
      title="Mitarbeiter"
      data={users}
      renderCard={renderUserCard}
      onAdd={(newUser) => {
        // SimpleCardEditor passes Partial<T>, but we cast it or validate it.
        // For API we need at least some fields, but mock handles it.
        addUser(newUser as Partial<User>);
      }}
      onEdit={(updatedUser) => {
        updateUser(updatedUser);
      }}
      onDelete={(id) => {
        deleteUser(id);
      }}
      fields={[
        { key: 'username', label: 'Benutzername', type: 'text' },
        { key: 'firstname', label: 'Vorname', type: 'text' },
        { key: 'lastname', label: 'Nachname', type: 'text' },
        { key: 'role', label: 'Rolle', type: 'select', options: [{label: 'Admin', value: 'admin'}, {label: 'Kellner', value: 'waiter'}] },
        { key: 'printer', label: 'Standard-Drucker', type: 'text' }
      ]}
    />
  );
};