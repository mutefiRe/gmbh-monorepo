import React, { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AppContext } from '../App';
import { SimpleCardEditor } from '../components/SimpleCardEditor';
import { LoadingNotice } from '../components/LoadingNotice';
import { Plus, Shield, User as UserIcon } from 'lucide-react';
import { User } from '../types';

export const UsersPage: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { users, addUser, updateUser, deleteUser, usersLoading, usersSaving } = context;
  const params = useParams();

  let isNew = params.id === 'new';

  const renderUserCard = (user: User) => (
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-primary-100 text-primary'
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

  const isBusy = usersLoading || usersSaving;
  const addButton = (
    <Link
      to={'new'}
      component="button"
      className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-colors shadow-sm font-semibold active:scale-95 ${isBusy
        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
        : 'bg-primary-600 text-white hover:bg-primary-700'
        }`}
      onClick={(event) => {
        if (isBusy) {
          event.preventDefault();
        }
      }}
    >
      <Plus size={20} />
      Hinzufügen
    </Link>
  );

  return (
    <>
      <LoadingNotice active={usersLoading} />
      <SimpleCardEditor<User & { password?: string }>
        gridClassName='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'
        title="Mitarbeiter"
        description="Rollen steuern die Zugriffsrechte im Admin und in der Kasse."
        data={users}
        isLoading={usersLoading}
        isSaving={usersSaving}
        renderCard={renderUserCard}
        onAdd={(newUser) => {
          // SimpleCardEditor passes Partial<T>, but we cast it or validate it.
          // For API we need at least some fields, but mock handles it.
          addUser(newUser as Partial<User & { password?: string }>);
        }}
        onEdit={(updatedUser) => {
          const updatedUserCopy = JSON.parse(JSON.stringify(updatedUser));
          delete updatedUserCopy.password;
          updateUser(updatedUserCopy);
        }}
        onDelete={(id) => {
          deleteUser(id);
        }}
        headerActions={addButton}
        dialogHint="Passwort nur bei neuen Benutzern setzen."
        fields={[
          { key: 'username', label: 'Benutzername', type: 'text' },
          { key: 'firstname', label: 'Vorname', type: 'text' },
          { key: 'lastname', label: 'Nachname', type: 'text' },
          { key: 'role', label: 'Rolle', type: 'select', options: [{ label: 'Admin', value: 'admin' }, { label: 'Kellner', value: 'waiter' }] },
          isNew ? { key: 'password', label: 'Passwort', type: 'password' } : null
        ].filter(Boolean) as any[]}
      />
    </>
  );
};
