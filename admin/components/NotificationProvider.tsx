import { createContext, useContext, useState, ReactNode } from 'react';

export type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

interface NotificationContextProps {
  notify: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

let notificationId = 0;

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = (message: string, type: NotificationType = 'info') => {
    const id = ++notificationId;
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3500);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] space-y-2">
        {notifications.map((n) => {
          let title = '';
          if (n.type === 'success') title = 'Erfolg';
          else if (n.type === 'error') title = 'Fehler';
          else title = 'Info';
          return (
            <div
              key={n.id}
              className={`px-4 py-3 rounded-lg shadow-lg text-white font-semibold animate-fadeIn ${n.type === 'success' ? 'bg-green-600' : n.type === 'error' ? 'bg-red-600' : 'bg-primary-600'
                }`}
            >
              <h3 className="mb-1 " >{title}</h3>
              <div className="text-sm">{n.message}</div>
            </div>
          )
        })}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification: () => NotificationContextProps = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
};
