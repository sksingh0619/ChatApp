export const unreadNotificationsF = (notifications) => {
    return notifications.filter((notification) => notification.isRead === false);
}