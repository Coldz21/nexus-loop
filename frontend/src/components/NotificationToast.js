import React, { useState, useEffect } from 'react';

const NotificationToast = ({ notifications, removeNotification }) => {
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 space-y-3 pointer-events-none" style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', zIndex: 9999, position: 'fixed', marginLeft: '-36px', paddingTop: '260px'}}>
      {notifications.map((notification) => (
        <ToastItem
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
};

const ToastItem = ({ notification, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto-remove after duration
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => {
        handleRemove();
      }, notification.duration);
      return () => clearTimeout(timer);
    }
  }, [notification.duration]);

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(notification.id);
    }, 300); // Animation duration
  };

  const getToastStyles = () => {
    const baseStyles = 'toast-item';
    const typeStyles = {
      success: 'toast-success',
      error: 'toast-error',
      warning: 'toast-warning',
      info: 'toast-info'
    };

    const visibilityClass = isVisible && !isExiting ? 'toast-visible' : '';
    const exitClass = isExiting ? 'toast-exiting' : '';

    return `${baseStyles} ${typeStyles[notification.type] || typeStyles.info} ${visibilityClass} ${exitClass}`;
  };

  const getIcon = () => {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[notification.type] || icons.info;
  };

  return (
    <div className={`${getToastStyles()} pointer-events-auto`} style={{marginLeft: '200px'}}>
      <div className="toast-content">
        <div className="toast-icon">{getIcon()}</div>
        <div className="toast-message">
          {notification.title && (
            <div className="toast-title">{notification.title}</div>
          )}
          <div className="toast-text">{notification.message}</div>
        </div>
        <button
          onClick={handleRemove}
          className="toast-close"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
      {notification.duration && notification.duration > 0 && (
        <div className="toast-progress">
          <div
            className="toast-progress-bar"
            style={{ animationDuration: `${notification.duration}ms` }}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationToast;
