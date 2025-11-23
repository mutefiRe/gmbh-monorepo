import Service from '@ember/service';

export default class NotificationMessagesService extends Service {
  info(message, options = {}) {
    // Implement info notification logic here
    // e.g., display a toast or log to console
    console.info('INFO:', message, options);
  }

  success(message, options = {}) {
    // Implement success notification logic here
    console.log('SUCCESS:', message, options);
  }

  error(message, options = {}) {
    // Implement error notification logic here
    console.error('ERROR:', message, options);
  }
}
